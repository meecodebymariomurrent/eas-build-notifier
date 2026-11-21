#!/usr/bin/env node

const {program} = require('commander');
const notify = require('./commands/notify');

program
    .name('eas-build-notifier')
    .description('Automatically send notifications during eas build steps')
    .command('notify')
    .option('-m, --message <message>', 'The message to use')
    .option('-f, --file <file>', 'The configuration file to use')
    .option('--best-effort', 'Log delivery failures and exit successfully')
    .action(notify);

program.parseAsync().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
