const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const notify = require('../commands/notify');

function createFixture(t) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'eas-build-notifier-'));
    t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
    fs.writeFileSync(path.join(directory, 'package.json'), '{"name":"test-app"}');
    fs.writeFileSync(path.join(directory, 'app.json'), '{"expo":{"name":"Test app","slug":"test-app"}}');
    const file = path.join(directory, 'notifier.json');
    return {directory, file, write: services => fs.writeFileSync(file, JSON.stringify({services}))};
}

test('configuration errors identify the entry and prevent partial sends', async t => {
    const fixture = createFixture(t);
    fixture.write([
        {name: 'slack', config: {webhookUrl: 'https://example.test/slack'}},
        null,
    ]);
    const fetch = t.mock.method(global, 'fetch');
    await assert.rejects(notify({file: fixture.file, bestEffort: true}), /services\[1\]: Expected a supported provider name/);
    assert.equal(fetch.mock.callCount(), 0);
});

test('best effort reports delivery failures and still sends to other providers', async t => {
    const fixture = createFixture(t);
    fixture.write([
        {name: 'slack', config: {webhookUrl: 'https://example.test/slack'}},
        {name: 'teams', config: {webhookUrl: 'https://example.test/teams'}},
    ]);
    const fetch = t.mock.method(global, 'fetch', async url => {
        return new Response(null, {status: url.endsWith('/slack') ? 503 : 202});
    });
    const warn = t.mock.method(console, 'warn', () => {});

    await notify({file: fixture.file, bestEffort: true});
    assert.equal(fetch.mock.callCount(), 2);
    assert.deepEqual(warn.mock.calls[0].arguments, ['slack: Notification request failed (HTTP 503)']);

    await assert.rejects(notify({file: fixture.file}), /slack: Notification request failed \(HTTP 503\)/);
});

test('CLI resolves references, attempts all providers, and distinguishes delivery and configuration errors', t => {
    const fixture = createFixture(t);
    fixture.write([
        {name: 'slack', config: {webhookUrl: {env: 'TEST_NOTIFIER_SLACK'}}},
        {name: 'teams', config: {webhookUrl: 'https://example.test/teams'}},
    ]);
    const preload = path.join(fixture.directory, 'mock-fetch.cjs');
    fs.writeFileSync(preload, `
        global.fetch = async (url, request) => {
            const label = new URL(url).pathname;
            if (label === '/slack') {
                console.log('Attempted Slack');
                return new Response('response-credential', {status: 503});
            }
            const card = JSON.parse(request.body).attachments[0].content;
            console.log(card.body[0].text.includes('Build for Test app') ? 'Attempted Teams' : 'Unexpected Teams content');
            return new Response(null, {status: 202});
        };
    `);

    const bin = path.resolve(__dirname, '..', require('../package.json').bin['eas-build-notifier']);
    const run = (value, ...flags) => spawnSync(process.execPath, [
        '--require', preload, bin, 'notify', '--file', 'notifier.json', ...flags,
    ], {
        cwd: fixture.directory,
        env: {...process.env, PWD: __dirname, TEST_NOTIFIER_SLACK: value},
        encoding: 'utf8',
    });

    const strict = run('https://example.test/slack?secret=url-credential');
    assert.equal(strict.status, 1);
    assert.match(strict.stdout, /Attempted Slack/, strict.stderr);
    assert.match(strict.stdout, /Attempted Teams/);
    assert.match(strict.stderr, /slack: Notification request failed \(HTTP 503\)/);
    assert.doesNotMatch(strict.stderr, /response-credential|url-credential/);

    const bestEffort = run('https://example.test/slack', '--best-effort');
    assert.equal(bestEffort.status, 0);
    assert.match(bestEffort.stderr, /slack: Notification request failed \(HTTP 503\)/);

    const invalid = run('', '--best-effort');
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /services\[0\]: Missing environment variable TEST_NOTIFIER_SLACK/);
    assert.equal(invalid.stdout, '');
});
