const createDefaultMessage = require("../messages/defaultMessage");
const {postJson} = require('./http');

async function sendMessageToSlack(serviceConfiguration, message) {
    if (serviceConfiguration.webhookUrl) {
        const textString = createDefaultMessage(serviceConfiguration, message, false);
        await postJson(serviceConfiguration.webhookUrl, {
            blocks: [{
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: textString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
                },
            }],
        });
    } else {
        throw new Error('Invalid slack service configuration');
    }
}

module.exports = sendMessageToSlack;
