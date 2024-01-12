import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'; // to avoid errors with devServer
import { BuildOptions } from './types/types';

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
    return {
        port: options.port ?? 5000,
        open: {
            target: ['http://localhost:5000/hsrExpressCalc'],
            app: {
                name: 'msedge',
                arguments: ['--new-window']
            }
        },
        historyApiFallback: true,
    }

}