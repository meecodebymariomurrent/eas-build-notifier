#!/usr/bin/env node

const {program} = require('commander');
const notify = require('./commands/notify');

program
    .name('eas-build-notifier')
    .description('Automatically send notifications during eas build steps')
    .command('notify')
    .option('-m, --message <message>', 'The message to use')
    .option('-f, --file <file>', 'The configuration file to use')
    .action(notify);

program.parse();
