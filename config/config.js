const path = require('path');

const pageMap = [
    {
        chunks: ['app'],
        inject: 'body',
        template: './src/srv/views/index.html',
        filename: './srv/views/index.html'
    }
];
const copyAssets = [
    {
        from: './srv/views/lib/*.html',
        to: './',
        context: path.join(__dirname, '../src')
    },
    {
        from: './srv/**/*.json',
        to: './',
        context: path.join(__dirname, '../src')
    },
];
const entry = {
    app: ['./src/static/app.js']
};

module.exports = {
    dev: {
        entry: entry,
        env: {
            NODE_ENV: '"development"'
        },
        port: 8081,
        assetsRoot: path.resolve(__dirname, '../build'),
        pageMap: pageMap,
        assetsSubDirectory: 'assets',
        publicPath: 'http://localhost:8081/',
        copyAssets: copyAssets,
    },
    build: {
        entry: entry,
        env: {
            NODE_ENV: '"production"'
        },
        assetsRoot: path.resolve(__dirname, '../build'),
        assetsSubDirectory: 'assets',
        // TODO: add oss domain name
        publicPath: '/',
        pageMap: pageMap,
        copyAssets: copyAssets,
    },
    prod: {
        entry: entry,
        env: {
            NODE_ENV: '"production"'
        },
        assetsRoot: path.resolve(__dirname, '../build'),
        assetsSubDirectory: 'assets',
        // TODO: add oss domain name
        publicPath: '/',
        pageMap: pageMap,
        copyAssets: copyAssets,
    },
};