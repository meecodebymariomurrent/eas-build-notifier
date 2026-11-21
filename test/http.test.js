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

test('postJson cancels successful response bodies before clearing the timeout', async () => {
    let bodyCancelled = false;
    global.fetch = async () => {
        const body = new ReadableStream({
            cancel() {
                bodyCancelled = true;
            },
        });
        return new Response(body, {status: 200});
    };

    await postJson('https://example.test/webhook', {text: 'test'});

    assert.equal(bodyCancelled, true);
});
