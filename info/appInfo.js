// Supports:
// `app.config.ts`
// `app.config.js`
// `app.config.json`
// `app.json`
function getAppInfo(projectRoot = '.') {
    const fs = require('fs');
    const path = require('path');

    for (const fileName of ['app.config.json', 'app.json']) {
        const filePath = path.join(projectRoot, fileName);
        if (fs.existsSync(filePath)) {
            try {
                return JSON.parse(fs.readFileSync(filePath, 'utf-8')).expo
                    || JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch {
                break;
            }
        }
    }

    try {
        const { getConfig } = require('@expo/config');
        const { exp } = getConfig(projectRoot);
        return exp;
    } catch {
        return null;
    }
}

module.exports = getAppInfo;
