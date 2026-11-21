// Supports:
// `app.config.ts`
// `app.config.js`
// `app.config.json`
// `app.json`
function getAppInfo(projectRoot = process.cwd(), onConfigError = () => {}) {
    const fs = require('fs');
    const path = require('path');

    const hasDynamicConfig = ['app.config.ts', 'app.config.js']
        .some(fileName => fs.existsSync(path.join(projectRoot, fileName)));
    try {
        const { getConfig } = require('@expo/config');
        const { exp } = getConfig(projectRoot, {skipSDKVersionRequirement: true, skipPlugins: true});
        if (exp) {
            return exp;
        }
    } catch {
        if (hasDynamicConfig) onConfigError();
    }

    if (hasDynamicConfig) {
        return null;
    }

    for (const fileName of ['app.config.json', 'app.json']) {
        const filePath = path.join(projectRoot, fileName);
        if (fs.existsSync(filePath)) {
            try {
                const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                return config.expo || config;
            } catch {
                onConfigError();
                break;
            }
        }
    }

    return null;
}

module.exports = getAppInfo;
