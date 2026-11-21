const getAppInfo = require("../info/appInfo");

function createDefaultMessage(serviceConfiguration, message, useHtmlCode = false){
    const easBuildId = process.env.EAS_BUILD_ID ?? '';
    const easBuildProfile = process.env.EAS_BUILD_PROFILE ?? '';
    const easBuildUsername = process.env.EAS_BUILD_USERNAME ?? '';
    const easBuildPlatform = process.env.EAS_BUILD_PLATFORM ?? '';
    const appInfo = getAppInfo(process.env.PWD || '.');
    let appName = process.env.npm_package_name;
    let appVersion = process.env.npm_package_version;
    let buildLink = null;
    if (appInfo && appInfo.name) {
        appName = appInfo.name;
    }
    if (appInfo && appInfo.version) {
        appVersion = appInfo.version;
    }
    if (appInfo && appInfo.slug && easBuildUsername && easBuildId) {
        buildLink = `Build Details: https://expo.dev/accounts/${easBuildUsername}/projects/${appInfo.slug}/builds/${easBuildId}`
    }

    const firstLine = `Build for ${appName} ${appVersion}`.trim();
    const secondLine = `EAS Build Id: ${easBuildId}`.trim();
    const thirdLine = `EAS Build Profile: ${easBuildProfile}`.trim();
    const fourthLine = `EAS Build Platform: ${easBuildPlatform}`.trim();
    const details = `${secondLine}\r\n${thirdLine}\r\n${fourthLine}\r\n\r\n${message ?? ''}`;
    const escapeHtml = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let textString = useHtmlCode
        ? `<b>${escapeHtml(firstLine)}</b>\r\n\r\n${escapeHtml(details)}`.trim()
        : `${firstLine}\r\n\r\n${details}`.trim();
    if (buildLink) {
        textString += `\r\n\r\n${useHtmlCode ? escapeHtml(buildLink) : buildLink}`;
    }
    return textString.trim();
}

module.exports = createDefaultMessage;
