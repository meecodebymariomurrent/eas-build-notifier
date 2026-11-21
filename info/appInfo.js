// Supports:
// `app.config.ts`
// `app.config.js`
// `app.config.json`
// `app.json`
function getAppInfo(projectRoot = '.') {
    const fs = require('fs');
    const path = require('path');

    try {
        const { getConfig } = require('@expo/config');
        const { exp } = getConfig(projectRoot);
        if (exp) {
            return exp;
        }
    } catch {
    }

    for (const fileName of ['app.config.json', 'app.json']) {
        const filePath = path.join(projectRoot, fileName);
        if (fs.existsSync(filePath)) {
            try {
                const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                return config.expo || config;
            } catch {
                break;
            }
        }
    }

    return null;
}

module.exports = getAppInfo;
