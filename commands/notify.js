const fs = require('fs');
const sendMessageToTelegram = require('../services/telegram');
const sendMessageToSlack = require('../services/slack');
const sendMessageToDiscord = require('../services/discord');
const sendMessageToTeams = require('../services/teams');

const availableServices = ['telegram', 'slack', 'discord', 'teams'];

function notify({file, message}) {
    if (file) {
        notifyFromFile(file, message);
    } else {
        console.info('No configuration file specified');
    }
}

function notifyFromFile(file, message) {
    try {
        if (fs.existsSync(file)) {
            const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
            if (data) {
                data.services.forEach((service) => {
                    notifyForService(service, message);
                });
            }
        } else {
            console.error(`${file} does not exist`);
        }
    } catch (error) {
        console.error(error);
    }
}

function notifyForService(service, message) {
    if (isSupportedService(service.name)) {
        const serviceConfiguration = service.config;
        if (service.name === 'telegram') {
            sendMessageToTelegram(serviceConfiguration, message);
        }
        if (service.name === 'slack') {
            sendMessageToSlack(serviceConfiguration, message);
        }
        if (service.name === 'discord') {
            sendMessageToDiscord(serviceConfiguration, message);
        }
        if(service.name === 'teams'){
            sendMessageToTeams(serviceConfiguration, message);
        }
    }
}

function isSupportedService(service) {
    return availableServices.includes(service);
}

module.exports = notify;
