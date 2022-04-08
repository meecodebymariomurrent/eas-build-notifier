const fs = require('fs');
const sendTelegramMessage = require('../services/telegram');

const availableServices = ['telegram'];

function notify({file, message}) {
    if (file) {
        notifyFromFile(file, message);
    }
}

function notifyFromFile(file, message) {
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        if (data) {
            data.services.forEach((service) => {
                notifyForService(service, message);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

function notifyForService(service, message) {
    if (isSupportedService(service.name)) {
        const serviceConfiguration = service.config;
        if (service.name === 'telegram') {
            sendTelegramMessage(serviceConfiguration, message);
        }
    }
}

function isSupportedService(service) {
    return availableServices.includes(service);
}

module.exports = notify;
