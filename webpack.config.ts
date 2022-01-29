import path from "path";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
    entry: "./src/index.tsx",
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.([jt]sx?)?$/,
                use: "swc-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    devServer: {
        static: path.join(__dirname, "build"),
        compress: true,
        port: 4000,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.join(__dirname, "public"), to: path.join(__dirname, "build") },
            ],
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            eslint: {
                files: "./src/**/*",
            },
        }),
        new CleanWebpackPlugin()
    ],
    //Remove bundle.js.LICENSE.txt
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
};

export default config;