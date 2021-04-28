const util = require('util')
const exec = util.promisify(require('child_process').exec)
const execSync = require('child_process').execSync
const cdnHost = require('./cdnHost')
const cdnHostList = Object.keys(cdnHost)
cdnHostList.unshift('all')
const chalk = require('chalk')
const dayjs = require('dayjs')
const inquirer = require('inquirer');

var questions = [
    {
        type: 'checkbox',
        name: 'type',
        message: '请选择打包的业务种类：',
        choices: cdnHostList,
        default: ['local'],
    },
    {
        type: 'list',
        name: 'autoPush',
        message: '是否自动部署？',
        choices: ['true', 'false'],
        default: 'false',
    },
];

inquirer.prompt(questions).then((answers) => {
    // console.log('\nOrder receipt:');
    // console.log(JSON.stringify(answers, null, '  '));
    buildFunc(answers.type, answers.autoPush)
});

async function buildFunc(buildList, autoPush) {
    let startTime = new Date().getTime()
    console.log(chalk.blue('开始打包...'))
    const buildAll = buildList.find(item => item === 'all');
    if (buildAll) buildList = cdnHostList.slice(1)
    for (let i = 0; i < buildList.length; i++) {
        const key = buildList[i];
        console.log(chalk.red(`正在打包项目${dayjs().format('YYYY-MM-DD HH:mm:ss')}：${key}`))
        await exec('npm run buildall --project=' + key)
    }
    console.log(chalk.blue(`打包结束文件在/zip目录查看,打包时长${(new Date().getTime() - startTime) / 1000}s`))
    if (autoPush === 'true') {
        execSync('npm run publish', { stdio: 'inherit' })
    }
}
// buildFunc()
