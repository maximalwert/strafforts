const { environment } = require('@rails/webpacker')

environment.loaders.set('typescript', {
    test: /.(ts|tsx)$/,
    exclude: /node_modules|vendor\/bundle/,
    loader: 'ts-loader'
});

module.exports = environment
