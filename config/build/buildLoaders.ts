import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshTypescipt from 'react-refresh-typescript';
import type { ModuleOptions } from 'webpack';
import { BuildOptions } from './types/types';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {

    const isDev = options.mode === 'development';

    const assetLoader = {
        test: /\.(png|jp(e)?g|svg|gif)$/i,
        type: 'asset/resource'
    }

    const cssLoaderWithModules = {
        loader: 'css-loader',
        options: {
            modules: {
                localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
            }
        }
    };

    const scssLoader = {
        // ts-loader умеет работать с jsx, иначе нужен был бы babel-loader
        test: /\.s[ac]ss$/i,
        use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            cssLoaderWithModules,
            'sass-loader'
        ]
    };

    // const tsLoader = {
    //     // ts-loader умеет работать с jsx, иначе нужен был бы babel-loader
    //     test: /\.tsx?$/i,
    //     use: 'ts-loader',
    //     exclude: /node_modules/
    // };

    const tsLoader = {
        test: /\.tsx?$/i,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true, //отключает проверку типов. проверять отдельным скриптом tsc
                    getCustomTransformers: () => ({
                        before: [isDev && ReactRefreshTypescipt()].filter(Boolean)
                    })
                }
            }
        ],
        exclude: /node_modules/
    }

    return [
        assetLoader,
        scssLoader,
        tsLoader
    ]
}