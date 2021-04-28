const webpack = require('webpack'),
    path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const resolvePath = path.join(__dirname, "../public/libs");

module.exports = {
    mode: "production",
    resolve: {
        extensions: [".js", ".jsx"]
    },
    entry: {
        vueBase: ['vue', 'vue-i18n', 'vue-native-websocket', 'vue-router', 'vuex', 'axios', 'pako', 'dayjs'],
    },
    output: {
        path: resolvePath,
        filename: "[name].[chunkhash:8].js",
        library: "lib_[name]"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            context: process.cwd(),
            path: path.resolve(resolvePath, "[name]-manifest.json"),
            name: 'lib_[name]'
        })
    ]
};