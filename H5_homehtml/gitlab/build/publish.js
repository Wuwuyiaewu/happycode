const scpClient = require('scp2')
const ora = require('ora')
const chalk = require('chalk')
const server = {
  name: '测试环境',
  host: '192.168.35.218',
  port: 242,
  username: 'root',
  password: 'Gold1234{}',
  domain: '192.168.35.218',
  path: '/opt/ix/ix_middle_home'
}
const spinner = ora('正在发布到' + (process.env.NODE_ENV === 'prod' ? '生产' : '测试') + '服务器...')
spinner.start()
scpClient.scp(
    'pages/',
    {
        host: server.host,
        port: server.port,
        username: server.username,
        password: server.password,
        privateKey: server.privateKey,
        path: server.path
    },
    function(err) {
        spinner.stop()
        if (err) {
            console.log(chalk.red('发布失败.\n'))
            throw err
        } else {
            console.log(chalk.green('Success! 成功发布到' + (process.env.NODE_ENV === 'prod' ? '生产' : '测试') + '服务器! \n'))
        }
    }
)
