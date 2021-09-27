const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'libreTranslationFeedback.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        modules: ['node_modules']
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            }
        ]
    }
};
