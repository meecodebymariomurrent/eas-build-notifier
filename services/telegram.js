const Slimbot = require('slimbot');

function sendTelegramMessage(item, message) {
    const easBuildId = process.env.EAS_BUILD_ID;
    const easBuildProfile = process.env.EAS_BUILD_PROFILE;
    const packageName = process.env.npm_package_name;
    const token = item.token;
    const bot = new Slimbot(token);
    const chatID = item.chatID;

    const firstLine = `Build for ${packageName}`.trim();
    const secondLine = `EAS Build Id: ${easBuildId ?? ''}`.trim();
    const thirdLine = `EAS Build Profile: ${easBuildProfile ?? ''}`.trim();
    const textString = `<b>${firstLine}</b>\r\n\r\n${secondLine}\r\n${thirdLine}\r\n\r\n${message ?? ''}`.trim();

    const optionalParams = {
        parse_mode: "HTML",
        caption: 'Build Notification'
    }

    bot.sendMessage(chatID, textString, optionalParams);
}

module.exports = sendTelegramMessage;
