const fs = require('fs');
const sendMessageToTelegram = require('../services/telegram');
const sendMessageToSlack = require('../services/slack');
const sendMessageToDiscord = require('../services/discord');
const sendMessageToTeams = require('../services/teams');

const availableServices = ['telegram', 'slack', 'discord', 'teams'];

async function notify({file, message}) {
    if (file) {
        await notifyFromFile(file, message);
    } else {
        console.error('No configuration file specified');
        process.exitCode = 1;
    }
}

async function notifyFromFile(file, message) {
    try {
        if (fs.existsSync(file)) {
            const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
            if (data && Array.isArray(data.services)) {
                await Promise.all(data.services.map((service) => notifyForService(service, message)));
            } else {
                throw new Error('Configuration must contain a services array');
            }
        } else {
            console.error(`${file} does not exist`);
            process.exitCode = 1;
        }
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
}

async function notifyForService(service, message) {
    if (isSupportedService(service.name)) {
        const serviceConfiguration = service.config;
        try {
            if (service.name === 'telegram') await sendMessageToTelegram(serviceConfiguration, message);
            if (service.name === 'slack') await sendMessageToSlack(serviceConfiguration, message);
            if (service.name === 'discord') await sendMessageToDiscord(serviceConfiguration, message);
            if (service.name === 'teams') await sendMessageToTeams(serviceConfiguration, message);
        } catch (error) {
            console.error(error);
            process.exitCode = 1;
        }
    } else {
        console.error(`Unsupported notification service: ${service.name}`);
        process.exitCode = 1;
    }
}

function isSupportedService(service) {
    return availableServices.includes(service);
}

module.exports = notify;
