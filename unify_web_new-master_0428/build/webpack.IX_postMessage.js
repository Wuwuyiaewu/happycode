const path = require('path')

module.exports = {
    mode: 'production',
    entry: './public/js/IX_postMessage.js',
    output: {
        path: path.join(__dirname, '../public/js'), // 输出的路径
        libraryTarget: 'commonjs2',
        filename: 'IX_postMessage.min.js', // 输出的文件，将会根据entry命名为vendor.dll.js
        library: 'IX_postMessage_library' // 暴露出的全局变量名
    }
}
