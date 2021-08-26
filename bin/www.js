#!/usr/bin/env node
console.log('hello jay-app-cli run...')
// !!! https://segmentfault.com/a/1190000037645106 一些node库 以及功能介绍

//! 第一行意思是指定node来运行

//! 使用chalk定义输出样式：
const chalk = require('chalk')
//!Semver是一个专门分析Semantic Version（语义化版本）的工具,比较两个版本号，也可以在命令行使用
const semver = require('semver')
const path = require('path')
//!minimist是nodejs的命令行参数解析工具
const minimist = require('minimist')
const requireVersion = require('../package.json').engines.node
//!用于输入类容和潜在的输入列表进行匹配
const didYouMean = require('didyoumean')
const logger = require('../lib/logger');
const fs = require('fs');
const axios = require('axios');

didYouMean.threshold = 0.6

function checkNodeVersion(wanted, id) {
    // if (!semver.satisfies(process.version)) {
    //     logger.error(
    //         chalk.red(
    //             'you are using Node' +
    //             process.version +
    //             ',but this version of' +
    //             id +
    //             ' requires Node' +
    //             wanted +
    //             '.please upgrade your Node version'
    //         )
    //     )
    //     process.exit(1)
    // }
}

checkNodeVersion(requireVersion, 'jay-app-cli')
if (semver.satisfies(process.version, '9.x')) {
    logger.warning(
        chalk.red(
            `You are using Node ${process.version}.` +
            `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.` +
            `It's strongly recommended to use an active LTS version instead.`
        )
    )
}


//! 完整的 node.js 命令行解决方案
const program = require('commander');
// ? 查看版本 
program.version(`jay-app-cli ${require('../package').version}`).usage('<command> [options]')
console.log('node 控制台指令:',process.argv) //node 控制台指令: [ '/usr/local/bin/node', '/usr/local/bin/jay-app-cli', 'jj' ]
program.parse(process.argv)
program
    .command('init <app-name>')
    .description('初始化项目模板或组件模板')
    .option('-C, --component', '创建组件模板')
    .action((name, cmd) => {
        const reg = /^[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$/
        if (!reg.test(name)) {
            logger.error(`${chalk.red('<app-name>')}${chalk.yellow(' 只允许英文字母数字-_，并且只能以字母开头，字母或数字结尾。')}`)
            process.exit(1);
        }
        const options = cleanArgs(cmd)//解析出来指令对象
        extraParams(3, 1)
        require('../lib/init')(name, options)
    })



    // 输出未知命令的帮助信息
program.arguments('<command>').action(cmd => {
    program.outputHelp();
    loggger.error(chalk.red(`错误的命令 ${chalk.yellow(cmd)}.`));
    suggestCommands(cmd);
});

program.on('--help', () => {
    loggger.info(`运行 ${chalk.cyan(`pare-cli <command> --help`)} 来详细了解命令。`);
});

program.commands.forEach(c => c.on('--help', () => console.log()));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

function suggestCommands(unknownCommand) {
    const availableCommands = program.commands.map(cmd => {
        return cmd._name;
    });

    const suggestion = didYouMean(unknownCommand, availableCommands);
    if (suggestion) {
        loggger.info(chalk.red(`您是不是想输入 ${chalk.yellow(suggestion)}?`));
    }
}

function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}


//! commander将命令对象本身作为选项传递， 只将实际的选项提取到一个新的对象
function cleanArgs(cmd) {
    const args = {}
    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/, ''))
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key]
        }
    })
    return args
}

// ! 提醒用户提供了多余的参数
function extraParams(index, length) {
    console.log('hkabdsabh',index, length)
    console.log('hkabdsabh',process.argv.slice(index))
    // if (minimist(process.argv.slice(index).length > length)) {
    //     logger.warning(chalk.yellow('你提供的多余的参数将被忽略'))
    // }
}