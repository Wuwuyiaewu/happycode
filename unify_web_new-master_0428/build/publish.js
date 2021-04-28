const scpClient = require('scp2')
const ora = require('ora')
const chalk = require('chalk')
const dayjs = require('dayjs')
const path = require('path')
const fs = require('fs-extra')
process.env.PROJECT_NAME = process.env.npm_config_project || '1'
const server = {
    name: '测试环境',
    host: '192.168.75.63',
    port: 242,
    username: 'root',
    password: 'Gold1234{}',
    domain: '192.168.35.218',
    path: '/cms/data/publiccms/web/site_2/h5/'
}
fs.removeSync(path.join(__dirname, '../cache/charting_library'))
console.log(chalk.green('文件删除成功，开始上传文件.\n'))
const spinner = ora('正在发布到' + (process.env.NODE_ENV === 'prod' ? '生产' : '测试') + '服务器...')
spinner.start()
scpClient.scp(
    'cache/',
    {
        host: server.host,
        port: server.port,
        username: server.username,
        password: server.password,
        privateKey: server.privateKey,
        path: server.path
    },
    function (err) {
        spinner.stop()
        if (err) {
            console.log(chalk.red('发布失败.\n'))
            throw err
        } else {
            console.log(chalk.green('Success! 成功发布到' + (process.env.NODE_ENV === 'prod' ? '生产' : '测试') + '服务器! \n' + '----发布时间:' + dayjs().format('YYYY/MM/DD HH:mm:ss')))
        }
    }
)
