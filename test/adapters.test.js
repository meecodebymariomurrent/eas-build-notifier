const test = require('node:test');
const assert = require('node:assert/strict');

const sendTelegram = require('../services/telegram');
const sendSlack = require('../services/slack');
const sendDiscord = require('../services/discord');
const sendTeams = require('../services/teams');

test('Telegram sends a valid HTML request', async () => {
    let captured;
    global.fetch = async (url, options) => {
        captured = {url, body: JSON.parse(options.body)};
        return new Response('', {status: 200});
    };

    await sendTelegram({token: 'test-token', chatID: '123'}, 'Build <ready>');

    assert.equal(captured.url, 'https://api.telegram.org/bottest-token/sendMessage');
    assert.equal(captured.body.chat_id, '123');
    assert.equal(captured.body.parse_mode, 'HTML');
    assert.match(captured.body.text, /Build &lt;ready&gt;/);
});

test('Slack sends an mrkdwn block request', async () => {
    let captured;
    global.fetch = async (url, options) => {
        captured = {url, body: JSON.parse(options.body)};
        return new Response('ok', {status: 200});
    };

    await sendSlack({webhookUrl: 'https://example.test/slack'}, 'Build ready');

    assert.equal(captured.url, 'https://example.test/slack');
    assert.equal(captured.body.blocks[0].type, 'section');
    assert.equal(captured.body.blocks[0].text.type, 'mrkdwn');
});

test('Discord sends an embed webhook request', async () => {
    let captured;
    global.fetch = async (url, options) => {
        captured = {url, body: JSON.parse(options.body)};
        return new Response('ok', {status: 200});
    };

    await sendDiscord({webhookUrl: 'https://example.test/discord'}, 'Build ready');

    assert.equal(captured.url, 'https://example.test/discord');
    assert.equal(captured.body.embeds[0].title, 'EAS Build Status');
    assert.match(captured.body.embeds[0].description, /Build ready/);
});

test('Teams sends an Adaptive Card request', async () => {
    let captured;
    global.fetch = async (url, options) => {
        captured = {url, body: JSON.parse(options.body)};
        return new Response('ok', {status: 200});
    };

    await sendTeams({webhookUrl: 'https://example.test/teams'}, 'Build ready');

    assert.equal(captured.url, 'https://example.test/teams');
    assert.equal(captured.body.type, 'message');
    assert.equal(captured.body.attachments[0].content.type, 'AdaptiveCard');
});

test('Invalid configurations fail explicitly', async () => {
    await assert.rejects(() => sendTelegram({}, 'Build'), /Invalid telegram service configuration/);
    await assert.rejects(() => sendSlack({}, 'Build'), /Invalid slack service configuration/);
    await assert.rejects(() => sendDiscord({}, 'Build'), /Invalid discord service configuration/);
    await assert.rejects(() => sendTeams({}, 'Build'), /Invalid teams service configuration/);
});
