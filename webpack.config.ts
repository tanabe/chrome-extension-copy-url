import * as path from "path";
import CopyWebpackPlugin from 'copy-webpack-plugin'

const config = (env: any, argv: any) => {
    return {
        entry: {
            background: path.join(__dirname, 'src', 'background.ts'),
            options: path.join(__dirname, 'src', 'options.ts')
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /.ts$/,
                    use: 'ts-loader',
                    exclude: '/node_modules/'
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'public', to: '.' }
                ]
            })
        ]
    }
}

export default config