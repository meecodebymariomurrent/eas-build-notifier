const fs = require('node:fs');
const getAppInfo = require('../info/appInfo');
const sendTelegram = require('../services/telegram');
const sendSlack = require('../services/slack');
const sendDiscord = require('../services/discord');
const sendTeams = require('../services/teams');

const providers = new Map([
    ['telegram', {send: sendTelegram, fields: ['token', 'chatID']}],
    ['slack', {send: sendSlack, fields: ['webhookUrl']}],
    ['discord', {send: sendDiscord, fields: ['webhookUrl']}],
    ['teams', {send: sendTeams, fields: ['webhookUrl']}],
]);

function resolveValue(value, field) {
    if (value && typeof value.env === 'string' && /^[A-Za-z_][A-Za-z0-9_]*$/.test(value.env)) {
        const variable = value.env;
        value = process.env[variable];
        if (!value?.trim()) throw new Error(`Missing environment variable ${variable} for ${field}`);
    }

    if (typeof value === 'string' && value.trim()) return value;
    if (field === 'chatID' && Number.isSafeInteger(value) && value !== 0) return value;
    throw new Error(`Invalid or missing ${field}`);
}

function readConfiguration(file) {
    let contents;
    try {
        contents = fs.readFileSync(file, 'utf8');
    } catch (error) {
        throw new Error(`Could not read configuration file (${error.code ?? 'read error'})`);
    }

    let data;
    try {
        data = JSON.parse(contents);
    } catch {
        throw new Error('Configuration file must contain valid JSON');
    }

    if (!Array.isArray(data?.services)) {
        throw new Error('Configuration must contain a services array');
    }

    return data.services.map((service, index) => {
        try {
            const provider = providers.get(service?.name);
            if (!provider) throw new Error('Expected a supported provider name');
            if (!service.config || typeof service.config !== 'object' || Array.isArray(service.config)) {
                throw new Error('Expected a config object');
            }
            const config = Object.fromEntries(provider.fields.map(field => [
                field, resolveValue(service.config[field], field),
            ]));
            if (config.webhookUrl && !['https:', 'http:'].includes(URL.parse(config.webhookUrl)?.protocol)) {
                throw new Error('Expected an HTTP or HTTPS webhookUrl');
            }
            return {name: service.name, send: provider.send, config};
        } catch (error) {
            throw new Error(`services[${index}]: ${error.message}`);
        }
    });
}

async function notify({file, message, bestEffort = false}) {
    if (!file) throw new Error('No configuration file specified');

    const services = readConfiguration(file);
    if (!services.length) return;

    const appInfo = getAppInfo(process.cwd(), () => {
        console.warn('Could not load Expo app metadata. Check your Expo app config and installed dependencies.');
    });

    const results = await Promise.allSettled(services.map(({send, config}) => send(config, message, appInfo)));
    const failures = results.flatMap((result, index) => {
        if (result.status === 'fulfilled') return [];
        return [`${services[index].name}: ${result.reason.message}`];
    });

    if (!failures.length) return;
    if (!bestEffort) throw new Error(failures.join('\n'));
    for (const failure of failures) console.warn(failure);
}

module.exports = notify;
