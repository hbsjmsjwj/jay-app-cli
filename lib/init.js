/**
 * 使用创建
 * poare-cli init demo 初始化一个项目
 * poare-cli init demo -c 初始化一个组件开发模板
 */

const chalk = require('chalk');
const path = require('path');
const fse = require('fs-extra'); //fs模块的拓展
const ora = require('ora');
const inquirer = require('inquirer');//与命令行交互
const download = require('./download');
const logger = require('./logger');

async function init(projectName, options) {
    const { component } = options
    // ! process.cwd() 返回的是当前Node.js进程执行时的工作目录
    const cwd = options.cwd || process.cwd()
    const targetDir = path.resolve(cwd, projectName)

    const dirName = `${component ? '组件模板' : '项目'}`

    //检测目录是否存在
    if (fse.pathExistsSync(targetDir)) {
        const { ok } = await inquirer.prompt([
            {
                name: 'ok',
                type: 'confirm',
                message: `${chalk.yellow(projectName)} ${dirName}目录已经存在，是否确认覆盖`
            }
        ])
        if (!ok) {
            process.exit(1)
        } else {
            // 清空目录
            fse.emptyDirSync(dirName)
        }
    }

    const downTemp = [
        {
            type: 'list',
            message: '请选择框架名称',
            name: 'type',
            choices: [
                'react',
                'vue',
                'eletron-vue',
                'eletron-react',
            ],
        }
    ]

    const type = await inquirer.prompt(downTemp)
    const typeValue = type.type
    logger.info(`你选择了${typeValue}`)

    if (fse.pathExistsSync(path.resolve(cwd, 'package.json'))) {
        logger.error(chalk.red(`不允许在${dirName}中初始化`));
        process.exit(1);
    }


    const spinner = ora().start(`🚀 ${dirName}初始化中`)

    // https://github.com/hbsjmsjwj/jay-app-cli-reactTemp.git
    let githubProUrl
    if (typeValue === 'vue') {
        githubProUrl = 'github:hbsjmsjwj/jay-app-cli-vueTemp'
    } else if(typeValue === 'react'){
        githubProUrl = 'github:hbsjmsjwj/jay-app-cli-reactTemp'
    }else if(typeValue === 'eletron-vue'){
        githubProUrl = 'github:hbsjmsjwj/jay-app-cli-vueElectronTemp'
    }else if(typeValue === 'eletron-react'){
        githubProUrl = 'github:hbsjmsjwj/jay-app-cli-reactElectronTemp'
    }
    //https://github.com/hbsjmsjwj/jay-app-cli-vueTemp.git
    //  const projectUrl = 'http://zc-git.paic.com.cn/frontend/cli-service-temp/repository/master/archive.zip';
    await download(`${githubProUrl}`, `${projectName}`);
    let currentPackageJson = require(path.resolve(cwd, `${projectName}/package.json`));
    currentPackageJson.name = projectName;
    currentPackageJson.description = projectName;
    if (component) {
        //如果是创建组件模板不需要查找micro id
        currentPackageJson.microId = 'jay-component';
    } else {
        currentPackageJson.microId = projectName; //microId 目前设置为name，此项应该与服务器通信保持唯一
    }

    fse.outputFileSync(`${projectName}/package.json`, JSON.stringify(currentPackageJson, null, 2));
    spinner.succeed(`${dirName}初始完成`);
    logger.info(`运行 ${chalk.yellow(`cd ${projectName}`)} 进入${dirName}目录`);
    logger.info(`运行 ${chalk.yellow('npm i')} 下载依赖包`);
    logger.info(`运行 ${chalk.yellow('npm run start')} 开发命令`);
    if (!component) {
        logger.info(`运行 ${chalk.yellow('npm run build')} 项目打包`);
        logger.info(`运行 ${chalk.yellow('npm run analyzer')} 性能分析`);
    }
    process.exit(1);
}

module.exports = (...args) => {
    return init(...args).catch(err => {
        logger.error(chalk.red(err));
        process.exit(1);
    });
}