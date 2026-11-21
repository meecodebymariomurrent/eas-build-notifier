const createDefaultMessage = require('../messages/defaultMessage');
const {postJson} = require('./http');

async function sendMessageToTelegram(serviceConfiguration, message, appInfo) {
    if (isValidConfiguration(serviceConfiguration)) {
        const textString = createDefaultMessage(appInfo, message, true);
        await postJson(`https://api.telegram.org/bot${serviceConfiguration.token}/sendMessage`, {
            chat_id: serviceConfiguration.chatID,
            text: textString,
            parse_mode: 'HTML',
        });
    } else {
        throw new Error('Invalid telegram service configuration');
    }
}

function isValidConfiguration(serviceConfiguration) {
    return serviceConfiguration.token && serviceConfiguration.chatID;
}

module.exports = sendMessageToTelegram;
