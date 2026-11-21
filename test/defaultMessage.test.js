const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const createDefaultMessage = require('../messages/defaultMessage');

test('HTML messages escape user-provided closing tags before adding bold markup', (t) => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'eas-build-notifier-'));
    t.after(() => {
        fs.rmSync(projectRoot, {recursive: true, force: true});
        for (const [key, value] of Object.entries(previousEnvironment)) {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    });

    const keys = ['PWD', 'npm_package_name', 'npm_package_version', 'EAS_BUILD_ID', 'EAS_BUILD_PROFILE', 'EAS_BUILD_PLATFORM', 'EAS_BUILD_USERNAME'];
    const previousEnvironment = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
    fs.writeFileSync(path.join(projectRoot, 'app.json'), JSON.stringify({expo: {slug: 'project'}}));
    process.env.PWD = projectRoot;
    process.env.npm_package_name = '</b>app';
    process.env.npm_package_version = '1</b>';
    process.env.EAS_BUILD_ID = '123</b>';
    process.env.EAS_BUILD_PROFILE = 'release';
    process.env.EAS_BUILD_PLATFORM = 'ios';
    process.env.EAS_BUILD_USERNAME = 'user</b>';

    const message = createDefaultMessage({}, '</b>message', true);

    assert.match(message, /^<b>Build for &lt;\/b&gt;app 1&lt;\/b&gt;<\/b>/);
    assert.match(message, /EAS Build Id: 123&lt;\/b&gt;/);
    assert.match(message, /&lt;\/b&gt;message/);
    assert.match(message, /accounts\/user&lt;\/b&gt;\/projects/);
});
