const test = require('node:test');
const assert = require('node:assert/strict');
const {postJson} = require('../services/http');

test('postJson reports unsuccessful webhook responses', async () => {
    global.fetch = async () => new Response('invalid webhook', {
        status: 400,
        statusText: 'Bad Request',
    });

    await assert.rejects(
        () => postJson('https://example.test/webhook', {text: 'test'}),
        /400 Bad Request.*invalid webhook/,
    );
});
