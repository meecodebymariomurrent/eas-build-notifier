const createDefaultMessage = require("../messages/defaultMessage");
const {postJson} = require('./http');

async function sendMessageToTeams(serviceConfiguration, message) {
    if (serviceConfiguration.webhookUrl) {
        const textString = createDefaultMessage(serviceConfiguration, message, false);
        await postJson(serviceConfiguration.webhookUrl, {
            type: 'message',
            attachments: [{
                contentType: 'application/vnd.microsoft.card.adaptive',
                contentUrl: null,
                content: {
                    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                    type: 'AdaptiveCard',
                    version: '1.2',
                    body: [{
                        type: 'TextBlock',
                        text: textString,
                        wrap: true,
                    }],
                },
            }],
        });
    } else {
        throw new Error('Invalid teams service configuration');
    }
}

module.exports = sendMessageToTeams;
