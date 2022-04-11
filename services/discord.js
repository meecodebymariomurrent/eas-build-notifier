const { Webhook, MessageBuilder } = require("discord-webhook-node");
const createDefaultMessage = require("../messages/defaultMessage");

function sendMessageToDiscord(serviceConfiguration, message) {
    if (serviceConfiguration.webhookUrl) {
        const hook = new Webhook(serviceConfiguration.webhookUrl);
        const textString = createDefaultMessage(serviceConfiguration, message);
        const discordMessage = new MessageBuilder()
            .setTitle("EAS Build Status")
            .setDescription(textString)
            .setTimestamp();
        hook.send(discordMessage);
    } else {
        console.error("Invalid discord service configuration");
    }
}

module.exports = sendMessageToDiscord;
