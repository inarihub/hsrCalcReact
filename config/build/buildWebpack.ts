import webpack from 'webpack';
import { buildDevServer } from './buildDevServer';
import { buildLoaders } from './buildLoaders';
import { buildPlugins } from './buildPlugins';
import { buildResolver } from './buildResolvers';
import { BuildOptions } from './types/types';

export function buildWebpack(options: BuildOptions): webpack.Configuration {
    const {mode, port, paths} = options;
    const isDev = mode === 'development';

    return {
        mode: mode ?? 'development',
        entry: paths.entry, //path.resolve(__dirname, 'src', 'index.tsx'),
        output: {
            path: paths.output, //path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            clean: true,
            assetModuleFilename: 'img/[hash:16][ext][query]'
        },
        module: { rules: buildLoaders(options) },
        resolve: buildResolver(options),
        plugins: buildPlugins(options),
        devtool: isDev ? 'source-map' : undefined,
        devServer: isDev ? buildDevServer(options) : undefined
    }
}