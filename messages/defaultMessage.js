const getAppInfo = require("../info/appInfo");

function createDefaultMessage(serviceConfiguration, message, useHtmlCode = false){
    const easBuildId = process.env.EAS_BUILD_ID ?? '';
    const easBuildProfile = process.env.EAS_BUILD_PROFILE ?? '';
    const appFullName = serviceConfiguration.appFullName ?? null;
    const appInfo = getAppInfo();
    let appName = process.env.npm_package_name;
    let appVersion = process.env.npm_package_version;
    let buildLink = null;
    if (appInfo && appInfo.expo && appInfo.expo.name) {
        appName = appInfo.expo.name;
    }
    if (appInfo && appInfo.expo && appInfo.expo.version) {
        appVersion = appInfo.expo.version;
    }
    if (appFullName && easBuildId) {
        buildLink = `Build Details: https://expo.dev/accounts/${appFullName}/${easBuildId}`
    }

    const firstLine = `Build for ${appName} ${appVersion}`.trim();
    const secondLine = `EAS Build Id: ${easBuildId}`.trim();
    const thirdLine = `EAS Build Profile: ${easBuildProfile}`.trim();
    let textString = `${useHtmlCode ? '<b>' : ''}${firstLine}${useHtmlCode ? '</b>' : ''}\r\n\r\n${secondLine}\r\n${thirdLine}\r\n\r\n${message ?? ''}`.trim();
    if (buildLink) {
        textString += `\r\n\r\n${buildLink}`;
    }
    return textString.trim();
}

module.exports = createDefaultMessage;
