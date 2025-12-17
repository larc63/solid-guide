const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = (env, argv) => {
    const isDevelopment = argv.mode === 'development';
    let todourl = isDevelopment ? 
                "todo@http://localhost:6301/todo/remoteEntry.js" :
                "todo@https://larc63.github.io/solid-guide/dashboard/todo/todo/remoteEntry.js"
    return {
        mode: 'development',
        entry: './index.js',
        output: {
            filename: 'main.js',
            path: __dirname + '/dist',
        },
        devServer: {
            port: 6300,
            hot: true,
            open: true,
            historyApiFallback: true,
            headers: {
                // 'Access-Control-Allow-Origin': '*' // CORS like Vite
            }
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,    // Match .js and .jsx files
                    exclude: /node_modules/, // Ignore dependencies
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html',
            }),
            new ModuleFederationPlugin({
                name: 'dashboard',
                filename: 'remoteEntry.js',
                remotes: {
                    todo: todourl,
                },
                shared: {
                    react: { singleton: true },
                    "react-dom": { singleton: true },
                    "react-router-dom": { singleton: true }
                }
            }),
        ],
    }
};