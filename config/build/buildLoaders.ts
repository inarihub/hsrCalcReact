import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshTypescipt from 'react-refresh-typescript';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import type { ModuleOptions } from 'webpack';
import { BuildOptions } from './types/types';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import path from 'path';

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {

    const isDev = options.mode === 'development';
    const isProd = options.mode === 'production';

    const fontLoader = {
        test: /\.(woff2?|ttf)$/i,
        type: 'asset/resource',
        generator: {
            filename: 'fonts/[hash][name][ext]'
        }
    }

    const assetImgLoader = {
        test: /\.(png|jp(e)?g|svg|gif)$/i,
        type: 'asset/resource',
        use: isProd ? [
            {
                loader: ImageMinimizerPlugin.loader,
                options: {
                    minimizer: {
                        implementation: ImageMinimizerPlugin.sharpMinify,
                        options: {
                            encodeOptions: {
                            
                            },
                        },
                    },
                },
            },
        ] : undefined,
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
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        includePaths: ['./src/styles'],
                    }
                }
            }
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
        assetImgLoader,
        scssLoader,
        tsLoader
    ]
}