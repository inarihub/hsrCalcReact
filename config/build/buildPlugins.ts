import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import { BuildOptions } from "./types/types";
import type { Configuration } from "webpack";
import path from "path";

export function buildPlugins({mode, paths, analyzer}: BuildOptions): Configuration['plugins'] {

    const isDev = mode === 'development';
    const isProd = mode === 'production';

    //always
    const plugins: Configuration['plugins'] = [
        new HtmlWebpackPlugin({
            template: paths.html,
            favicon: path.resolve(paths.public, 'favicon.ico')
        }),
        new ForkTsCheckerWebpackPlugin()

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
            // new CopyWebpackPlugin(
            //     {
            //         patterns: [
            //             {from: path.resolve(paths.public, 'smh'), to: path.resolve(paths.output, 'smh')}
            //         ]
            //     }
            // )
        );
    }

    if(analyzer) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return plugins;
}