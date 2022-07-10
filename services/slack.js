const SlackNotify = require('slack-notify');
const createDefaultMessage = require("../messages/defaultMessage");

function sendMessageToSlack(serviceConfiguration, message) {
    if (serviceConfiguration.webhookUrl) {
        try {
            const slack = SlackNotify(serviceConfiguration.webhookUrl);
            const textString = createDefaultMessage(serviceConfiguration, message, true);
            slack.send(
                {
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": textString,
                            },
                        }
                    ]
                }
            );
        } catch (error) {
            console.error(error);
        }
    } else {
        console.error('Invalid slack service configuration');
    }
}

module.exports = sendMessageToSlack;
