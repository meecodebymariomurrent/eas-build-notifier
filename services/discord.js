const createDefaultMessage = require("../messages/defaultMessage");
const {postJson} = require('./http');

async function sendMessageToDiscord(serviceConfiguration, message) {
    if (serviceConfiguration.webhookUrl) {
        const textString = createDefaultMessage(serviceConfiguration, message);
        await postJson(serviceConfiguration.webhookUrl, {
            embeds: [{
                title: 'EAS Build Status',
                description: textString,
                timestamp: new Date().toISOString(),
            }],
        });
    } else {
        throw new Error("Invalid discord service configuration");
    }
}

module.exports = sendMessageToDiscord;
