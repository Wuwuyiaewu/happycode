const path = require('path')
const webpack = require('webpack')
// const FileManagerPlugin = require('filemanager-webpack-plugin')
const dayjs = require('dayjs')
const TerserPlugin = require('terser-webpack-plugin')
const projectAboutCdn = require('./build/cdnHost')
// const writeJson = require('./build/writeJson')
function resolve (dir) {
    return path.join(__dirname, dir)
}
// 记录本次变异时间，显示在html标签的data-buildTime属性
process.env.VUE_APP_build = dayjs().format('YYYY-MM-DD HH:mm')
const VUE_APP_mode = process.env.VUE_APP_mode
const indexPage = VUE_APP_mode && VUE_APP_mode === 'chart' ? 'src/pages/mobile/outputComponent/chart.js' : 'src/pages/mobile/main.js'
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 8085 // dev port
const cdnHost = projectAboutCdn[process.env.npm_config_project] ? projectAboutCdn[process.env.npm_config_project].cdnURL : '/'
const pageTitle = projectAboutCdn[process.env.npm_config_project] ? projectAboutCdn[process.env.npm_config_project].title : 'Cats交易'
// process.env.VUE_APP_apiUrl = projectAboutCdn[process.env.npm_config_project] ? projectAboutCdn[process.env.npm_config_project].apiURL : null
process.env.VUE_APP_apiUrl = process.env.NODE_ENV === 'production' ? '{{apiURL}}' : ''
process.env.VUE_APP_project = process.env.npm_config_project
const plugins = [
    new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require(path.join(__dirname, 'public/libs/vueBase-manifest.json'))
    })
]

// if (process.env.NODE_ENV === 'production') {
//     if (process.env.npm_config_project) {
//         // writeJson(pageTitle, process.env.npm_config_project)
//         plugins.push(
//             new FileManagerPlugin({
//                 onEnd: {
//                     copy: [
//                         { source: resolve(`src/extra/desktop/${process.env.npm_config_project}.png`), destination: resolve('dist/images/icon.png') },
//                         { source: resolve(`src/extra/favicon/${process.env.npm_config_project}.ico`), destination: resolve('dist/favicon.ico') },
//                         { source: resolve(`src/extra/manifest/${process.env.npm_config_project}.json`), destination: resolve('dist/manifest.json') }
//                     ],
//                     mkdir: [resolve('zip')],
//                     delete: [resolve(`zip/${process.env.npm_config_project}**.zip`), resolve('dist/customConfig.json')],
//                     archive: [{ source: resolve('dist'), destination: resolve(`zip/${process.env.npm_config_project}_${dayjs().format('MMDDHHmm')}.zip`) }]
//                 }
//             })
//         )
//     } else {
//         plugins.push(
//             new FileManagerPlugin({
//                 onEnd: {
//                     mkdir: [resolve('zip')],
//                     delete: [resolve('zip/*.zip'), resolve('dist/customConfig.json')],
//                     archive: [{ source: resolve('dist'), destination: resolve(`zip/dist_${dayjs().format('MMDDHHmm')}.zip`) }]
//                 }
//             })
//         )
//     }
// }

// All configuration item explanations can be find in https://cli.vuejs.org/config/
// 填写业务关联的cdn地址
module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: process.env.NODE_ENV === 'production' ? '{{cdnURL}}' : '/',
    outputDir: 'dist',
    assetsDir: 'static',
    // lintOnSave: process.env.NODE_ENV === 'development',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: port,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/': {
                target: 'http://localhost:' + port,
                // changeOrigin: true,
                bypass: function (req, res, proxyOptions) {
                    if (req.headers.accept.indexOf('html') !== -1) {
                        // console.log('Skipping proxy for browser request.', req)
                        const userAgent = req.headers['user-agent']
                        const reg = /mobile|android|iphone|ipad|phone/i
                        return reg.test(userAgent) ? '/index.html' : '/pc.html'
                    }
                }
            },
            '/apidata': {
                changeOrigin: false,
                target: 'https://api.mc90000.com',
                pathRewrite: {
                    '^/apidata': '/api'
                }
            }
        }
        // proxy: {
        //     '/unify-activity': {
        //         target: 'https://testgwactivity.gwfx.hk'
        //     }
        // }
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('preload-index').delete('prefetch-index')
        config.plugins.delete('preload-pc').delete('prefetch-pc')
        console.log(process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'production') {
            // config.optimization.minimizer([
            //     new TerserPlugin({
            //         terserOptions: {
            //             compress: {
            //                 pure_funcs: ['console.table', 'console.log'] // 配置发布时，不被打包的函数
            //                 // drop_console: true
            //             }
            //         }
            //     })
            // ])
            config.optimization.minimizer('js').use(TerserPlugin, [
                {
                    terserOptions: {
                        compress: {
                            pure_funcs: ['console.table', 'console.log'] // 配置发布时，不被打包的函数
                            // drop_console: true
                        }
                    }
                }
            ])
            if (process.env.NODE_ENV === 'production') {
                config.plugin('copy').tap(args => {
                    const newParams = [
                        /* 传递给 html-webpack-plugin's 构造函数的新参数 */
                        [
                            {
                                ...args[0][0],
                                transform (content, p) {
                                    let str = ''
                                    if (/public\\charting_library\\static\\.+chart\.[A-z0-9]+\.html/.test(p)) {
                                        const cdnPath = cdnHost === '/' ? '' : '{{cdnURL}}charting_library/static/'
                                        str = content.toString('utf-8')
                                        str = str.replace(/(<script[^<]*src=)["']{1}([^'"]+js)["']{1}([^<]*<\/script>)/g, `$1"${cdnPath}$2"$3`)
                                        str = str.replace(/(<link[^<]*href=)["']{1}([^'"]+css)["']{1}([^<]*\/>)/g, `$1"${cdnPath}$2"$3`)
                                    }
                                    return str ? Buffer.from(str) : content
                                }
                            }
                        ]
                    ]
                    return newParams
                })
            }
        }
    },
    configureWebpack: {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    default: false
                }
            }
        },
        plugins: plugins,
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        resolve: {
            alias: {
                '@public': resolve('public'),
                '@': resolve('src'),
                '@m': resolve('src/pages/mobile'),
                '@pc': resolve('src/pages/pc')
            }
        },
        output: {
            libraryExport: 'default'
        }
    },
    pages: {
        index: {
            entry: indexPage,
            title: process.env.NODE_ENV === 'production' ? '{{title}}' : pageTitle,
            mode: process.env.NODE_ENV
        },
        pc: {
            // page 的入口
            entry: 'src/pages/pc/main.js',
            // 模板来源
            template: 'public/pc.html',
            // 在 dist/pc.html 的输出
            filename: 'pc.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Trade',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'pc'],
            mode: process.env.NODE_ENV
        },
        upgrading: {
            // page 的入口
            entry: 'src/pages/upgrading/main.js',
            // 模板来源
            template: 'public/upgrading.html',
            // 在 dist/pc.html 的输出
            filename: 'upgrading.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: '',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'upgrading'],
            mode: process.env.NODE_ENV
        }
    }
}
