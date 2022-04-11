const Slimbot = require('slimbot');
const createDefaultMessage = require('../messages/defaultMessage');

function sendMessageToTelegram(serviceConfiguration, message) {
    if (isValidConfiguration(serviceConfiguration)) {
        const token = serviceConfiguration.token;
        const bot = new Slimbot(token);
        const chatID = serviceConfiguration.chatID;
        const textString = createDefaultMessage(serviceConfiguration, message, true);

        const optionalParams = {
            parse_mode: "HTML",
            caption: 'Build Notification'
        }

        bot.sendMessage(chatID, textString, optionalParams);
    } else {
        console.error('Invalid telegram service configuration');
    }
}

function isValidConfiguration(serviceConfiguration) {
    return serviceConfiguration.token && serviceConfiguration.chatID;
}

module.exports = sendMessageToTelegram;
