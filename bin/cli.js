#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const log = require('../lib/log');

const _ = require('lodash');
const ArgumentParser = require('argparse').ArgumentParser;

const packageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

// http://nodeca.github.io/argparse/#HelpFormatter.prototype.addArgument
const cliParser = new ArgumentParser({
    version: packageConfig.version,
    addHelp:true,
    description: 'mdtodocs cli example'
});

cliParser.addArgument(['--verbose'], {
    help: 'Display the progress message.'
});

const args = cliParser.parseArgs();

const verbose = args.verbose === 'true' ? true : false;

// publish 시작
new (require('../index.js'))({verbose: verbose}).convert();