function createDefaultMessage(appInfo, message, useHtmlCode = false) {
    const easBuildId = process.env.EAS_BUILD_ID ?? '';
    const easBuildProfile = process.env.EAS_BUILD_PROFILE ?? '';
    const easBuildUsername = process.env.EAS_BUILD_USERNAME ?? '';
    const easBuildPlatform = process.env.EAS_BUILD_PLATFORM ?? '';
    const appName = appInfo?.name || process.env.npm_package_name || 'app';
    const appVersion = appInfo?.version || process.env.npm_package_version || '';
    let buildLink = null;
    if (appInfo?.slug && (appInfo.owner || easBuildUsername) && easBuildId) {
        const [owner, slug, buildId] = [appInfo.owner || easBuildUsername, appInfo.slug, easBuildId].map(encodeURIComponent);
        buildLink = `Build Details: https://expo.dev/accounts/${owner}/projects/${slug}/builds/${buildId}`;
    }

    const firstLine = `Build for ${appName} ${appVersion}`.trim();
    const secondLine = `EAS Build Id: ${easBuildId}`.trim();
    const thirdLine = `EAS Build Profile: ${easBuildProfile}`.trim();
    const fourthLine = `EAS Build Platform: ${easBuildPlatform}`.trim();
    const status = process.env.EAS_BUILD_STATUS;
    const buildDetails = [secondLine, thirdLine, fourthLine];
    if (status) buildDetails.push(`EAS Build Status: ${status}`);
    const details = `${buildDetails.join('\r\n')}\r\n\r\n${message ?? ''}`;
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
