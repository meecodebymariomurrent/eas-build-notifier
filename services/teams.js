const {IncomingWebhook} = require('ms-teams-webhook');
const createDefaultMessage = require("../messages/defaultMessage");

function sendMessageToTeams(serviceConfiguration, message) {
    if (serviceConfiguration.webhookUrl) {
        try {
            const webhook = new IncomingWebhook(serviceConfiguration.webhookUrl);
            const textString = createDefaultMessage(serviceConfiguration, message, false);
            const teamsMessage = {
                "type": "message",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.adaptive",
                        "contentUrl": null,
                        "content": {
                            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                            "type": "AdaptiveCard",
                            "version": "1.2",
                            "body": [
                                {
                                    "type": "TextBlock",
                                    "text": textString,
                                    "wrap": true
                                }
                            ]
                        }
                    }
                ]
            }
            webhook.send(JSON.stringify(teamsMessage)).catch(console.error);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.error('Invalid teams service configuration');
    }
}

module.exports = sendMessageToTeams;
