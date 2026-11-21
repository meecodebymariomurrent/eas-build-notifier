const test = require('node:test');
const fs = require('node:fs');
const {parseEnv} = require('node:util');

const providers = [
    ['Telegram', require('../services/telegram'), {token: 'TEST_TELEGRAM_BOT_TOKEN', chatID: 'TEST_TELEGRAM_CHAT_ID'}],
    ['Slack', require('../services/slack'), {webhookUrl: 'TEST_SLACK_WEBHOOK_URL'}],
    ['Discord', require('../services/discord'), {webhookUrl: 'TEST_DISCORD_WEBHOOK_URL'}],
    ['Teams', require('../services/teams'), {webhookUrl: 'TEST_TEAMS_WEBHOOK_URL'}],
];

test('live webhook delivery', async t => {
    if (!fs.existsSync('.env.test')) {
        t.skip('Copy .env.test.example to .env.test and configure a test destination.');
        return;
    }

    let credentials;
    try {
        credentials = parseEnv(fs.readFileSync('.env.test', 'utf8'));
    } catch {
        throw new Error('Could not read .env.test');
    }

    for (const [name, send, fields] of providers) {
        await t.test(name, async t => {
            const entries = Object.entries(fields);
            if (entries.every(([, key]) => !credentials[key]?.trim())) {
                t.skip('No test credentials configured for this provider.');
                return;
            }

            const config = Object.fromEntries(entries.map(([field, key]) => {
                const value = credentials[key]?.trim();
                if (!value) throw new Error(`Set ${key} in .env.test`);
                return [field, value];
            }));
            await send(config, 'EAS Build Notifier live integration test. No build was triggered.');
        });
    }
});
