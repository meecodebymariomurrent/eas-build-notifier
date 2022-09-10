// Supports:
// `app.config.ts`
// `app.config.js`
// `app.config.json`
// `app.json`
function getAppInfo(projectRoot = '.') {
    try {
        const { getConfig } = require('@expo/config');
        const { exp } = getConfig(projectRoot);
        return exp;
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = getAppInfo;
