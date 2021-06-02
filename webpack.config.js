const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path')

module.exports = {
    entry: {
        main: './src/js/app.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.join(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpe?g|gif|ico|svg|webmanifest)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]'
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            chunks: ['main']
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        publicPath: '/',
        port: 9000
    },
}

