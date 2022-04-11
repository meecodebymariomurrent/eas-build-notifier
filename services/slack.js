const SlackNotify = require('slack-notify');
const createDefaultMessage = require("../messages/defaultMessage");

function sendMessageToSlack(serviceConfiguration, message) {
    if (serviceConfiguration.webhookUrl) {
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
        )
    } else {
        console.error('Invalid slack service configuration');
    }
}

module.exports = sendMessageToSlack;
