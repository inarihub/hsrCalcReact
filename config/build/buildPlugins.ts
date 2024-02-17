import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import { BuildOptions } from "./types/types";
import { type Configuration, DefinePlugin } from "webpack";
import path from "path";

export function buildPlugins({mode, paths, analyzer}: BuildOptions): Configuration['plugins'] {

    const isDev = mode === 'development';
    const isProd = mode === 'production';

    //always
    const plugins: Configuration['plugins'] = [
        new HtmlWebpackPlugin({
            template: paths.html,
            favicon: path.resolve(paths.public, 'favicon.ico'),
            chunks: ['main']
        }), new HtmlWebpackPlugin({
            filename: '404.html',
            template: paths.html404,
            favicon: path.resolve(paths.public, 'favicon.ico'),
            chunks: ['respondPages']
        }),
        new ForkTsCheckerWebpackPlugin(),
        new DefinePlugin(({
            APP_VERSION: JSON.stringify(require("../../package.json").version),
          }))
    ];

    //dev
    if(isDev) {
        plugins.push(
            new ReactRefreshWebpackPlugin()
        );
    }

    //prod
    if(isProd) {
        plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:16].css'
            }),
        );
    }

    if(analyzer) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return plugins;
}