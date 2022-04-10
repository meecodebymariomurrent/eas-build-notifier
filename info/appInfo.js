const fs = require('fs');

function getAppInfo() {
    const fileName = 'app.json';
    if (fs.existsSync(fileName)) {
        return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    } else {
        console.error(fileName, ' not found');
        return null;
    }
}

module.exports = getAppInfo;
