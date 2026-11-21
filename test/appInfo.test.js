const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const getAppInfo = require('../info/appInfo');

test('getAppInfo resolves dynamic config over app.json', (t) => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'eas-build-notifier-'));
    t.after(() => fs.rmSync(projectRoot, {recursive: true, force: true}));
    fs.writeFileSync(path.join(projectRoot, 'package.json'), JSON.stringify({name: 'test-project'}));
    fs.writeFileSync(path.join(projectRoot, 'app.json'), JSON.stringify({
        expo: {name: 'Static name', slug: 'static-project', sdkVersion: '54.0.0'},
    }));
    fs.writeFileSync(path.join(projectRoot, 'app.config.js'), `
        module.exports = ({config}) => ({
            ...config,
            name: 'Dynamic name',
            slug: 'dynamic-project',
        });
    `);

    const appInfo = getAppInfo(projectRoot);

    assert.equal(appInfo.name, 'Dynamic name');
    assert.equal(appInfo.slug, 'dynamic-project');
});
