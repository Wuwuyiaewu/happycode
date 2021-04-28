const inquirer = require('inquirer')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const distDir = path.join(__dirname, '../dist/')
const zipDir = path.join(__dirname, '../zip')
const cacheDir = path.join(__dirname, '../cache')
const cdnHost = require('./cdnHost')
const AdmZip = require('adm-zip')
const dayjs = require('dayjs')
const chalk = require('chalk')
const cdnHostArray = []
const art = require('art-template')
const choices = Object.keys(cdnHost)
choices.unshift('all')
var questions = [
    {
        type: 'checkbox',
        name: 'type',
        message: '请选择打包的业务种类：',
        choices: choices,
        default: ['local'],
    },
    {
        type: 'list',
        name: 'autoPush',
        message: '是否自动部署？',
        choices: ['true', 'false'],
        default: 'false',
    },
]

inquirer.prompt(questions).then((answers) => {
    const buildAll = answers.type.find(item => item === 'all')
    for (const key in cdnHost) {
        if (buildAll) {
            cdnHostArray.push(Object.assign(cdnHost[key], {
                _name: key
            }))
        } else {
            if (answers.type.indexOf(key) > -1) {
                cdnHostArray.push(Object.assign({
                    _name: key
                }, cdnHost[key]))
            }
        }
    }
    buildFunc(answers.autoPush)
})

const buildFunc = async function (autoPush) {
    const _startTime = Date.now()
    console.log(chalk.blue('项目打包中...'))
    await exec('npm run build')
    console.log(chalk.blue('业务分包中...'))
    // 清空zip目录
    await fs.emptyDir(path.join(zipDir))
    // 删除临时文件夹
    await fs.remove(cacheDir)
    // 创建临时目录
    await fs.copy(distDir, cacheDir)
    const jsFile = glob.sync('**/*.js', {
        cwd: path.join(distDir, '/static'),
    }).map(item => (path.join('static', item)))
    const cssFile = glob.sync('**/*.css', {
        cwd: path.join(distDir, '/static'),
    }).map(item => (path.join('static', item)))
    const htmlFile = glob.sync('**/*.html', {
        cwd: distDir
    })
    const basePath = path.join(__dirname, '../src/extra/')
    console.log(art)
    for (const cdn of cdnHostArray) {
        console.log(chalk.red(`正在打包项目${dayjs().format('YYYY-MM-DD HH:mm:ss')}：${cdn._name}`))
        try {
            await fs.remove(path.join(cacheDir, 'icon.png'))
            await fs.remove(path.join(cacheDir, 'favicon.ico'))
            await fs.remove(path.join(cacheDir, 'manifest.json'))

            await fs.copy(path.join(basePath, `/desktop/${cdn._name}.png`), path.join(cacheDir, 'icon.png'))
            await fs.copy(path.join(basePath, `/favicon/${cdn._name}.ico`), path.join(cacheDir, 'favicon.ico'))
            await fs.copy(path.join(basePath, `/manifest/${cdn._name}.json`), path.join(cacheDir, 'manifest.json'))

            jsFile.concat(htmlFile, cssFile).forEach(async (item) => {
                const fileStr = fs.readFileSync(path.join(distDir, item)).toString()
                await fs.writeFileSync(path.join(cacheDir, item), art.render(fileStr, cdn))
            })
            const _zip = new AdmZip()
            _zip.addLocalFolder(cacheDir)
            _zip.writeZip(path.join(zipDir, `${cdn._name}_${dayjs().format('MMDDHHmm')}.zip`))
        } catch (error) {
        }
    }
    console.log(chalk.blue(`项目打包完成，耗时${(Date.now() - _startTime) / 1000}`))
    if (autoPush === 'true') {
        exec('npm run publish')
            .finally(res => {
                fs.emptyDir(cacheDir)
            })
    } else {
        await fs.emptyDir(cacheDir)
    }
}
// buildFunc()
