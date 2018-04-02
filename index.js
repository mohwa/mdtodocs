
const fs = require('fs');
const path = require('path');
const process = require('process');

const _ = require('lodash');
const chalk = require('chalk');
const fse = require('fs-extra');
const glob = require('glob');
const log = require('./lib/log');

const { execSync, spawnSync } = require('child_process');

const CONFIG_FILE_NAME = '.mdtodocs.json';

// 파일 또는 디렉토리 경로값을 가진 속성
const ATTR_WITH_FILE_OR_DIR = {
    "log": true,
    "abbreviations": true,
    "template": true,
    "print-default-data-file": true,
    "syntax-definition": true,
    "include-in-header": true,
    "include-before-body": true,
    "include-after-body": true,
    "reference-doc": true,
    "bibliography": true,
    "csl": true,
    "citation-abbreviations": true,
    "data-dir": true,
    "extract-media": true,
    "filter": true
};

/**
 * MdToDocs 클래스
 */
class MdToDocs{

    constructor(){

        this.root = process.env.PWD;

        this.init();
    }
    init(){

        const root = this.root;
        const configPath = path.resolve(root, CONFIG_FILE_NAME);

        if (!fse.pathExistsSync(configPath)){
            log.fatal('not found `.mdtodocs.json` config file in root path');
            return;
        }

        const config = this.config = JSON.parse(fse.readFileSync(configPath, 'utf-8'));
        const outputTypes = this.outputTypes = config.outputTypes || [];

        if (!_.isArray(outputTypes) || !_.size(outputTypes)){
            log.fatal('not found outputTypes property');
            return;
        }

        this.src = config.src || [];
        const dist = this.dist = path.join(root, config.dist) || `${root}/dist`;

        if (!fse.pathExistsSync(dist)) fse.mkdirsSync(dist);
    }
    convert(){

        const root = this.root;
        const src = this.src;
        const dist = this.dist;
        const outputTypes = this.outputTypes;

        const defaultOpts = this.defaultOpts = {
            from: "markdown",
            toc: true,
            "toc-depth": "2",
            "highlight-style": "tango"
        };

        const to = {
            docx: 'docx',
            latex: 'latex'
        };

        _.forEach(src, v => {

            const files = glob.sync(path.join(root, v));

            // entry list 출력해주기
            log.log('Entry files...', 'green');
            log.log(files.join('\n'), 'whiteBright');

            _.forEach(files, file => {

                _.forEach(outputTypes, type => {

                    const convertFileName = _getFileName(type, path.basename(file).replace(/.[a-z]+$/, ''));

                    defaultOpts.output = path.join(dist, convertFileName);
                    defaultOpts.to = to[type];

                    _exec.call(this, type, file);
                });
            });
        });
    }
}

/**
 *
 * @param type
 * @param file - md file path
 * @private
 */
function _exec(type = 'docx', file = ''){

    const opts = _getOptions.call(this, type);
    const variables = _setVariables.call(this, type);

    const command = `pandoc ${opts} ${variables} ${file}`;

    log.log('\nRun command...', 'green');
    log.log(`${command}`, 'yellow');

    spawnSync('pandoc', [opts, variables, file], {stdio: 'inherit', shell: true});

}

/**
 *
 * @param type
 * @private
 */
function _getOptions(type = 'docx'){

    const ret = [];

    const defaultOpts = this.defaultOpts;
    const config = this.config;
    const root = this.root;

    let opts = config.templates[type].opts;

    opts = _.assign({}, defaultOpts, opts);

    _.map(opts, (v, k) => {

        const isFileValue = ATTR_WITH_FILE_OR_DIR[k];

        if (_.isBoolean(v) && v){
            ret.push(`--${k}`);
        }
        else{

            if (isFileValue) v = path.join(root, v);

            ret.push(`--${k}=${v}`);
        }
    });

    return ret.join(' ');
}

/**
 *
 * @returns {string}
 * @private
 */
function _setVariables(type = 'docx'){

    var ret = [];

    const config = this.config;
    let variables = {};

    if (
    config.templates &&
    config.templates[type] &&
    config.templates[type].variables){
        variables = config.templates[type].variables;
    }

    _.map(variables, (v, k) => {
        ret.push(`--variable ${k}=${v}`);
    });

    return ret.join(' ');
}

/**
 *
 * @param type
 * @param fileName
 * @returns {*}
 * @private
 */
function _getFileName(type = 'docx', fileName =  ''){
    return type === 'docx' ? `${fileName}.docx` : `${fileName}.pdf`;
}


module.exports = MdToDocs;