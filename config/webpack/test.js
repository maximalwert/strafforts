const merge = require('webpack-merge')
const environment = require('./environment')

const customConfig = {
    output: {
        filename: '[name].bundle.js'
    }
};

const extractText = environment.plugins.get('ExtractText');
extractText.filename = '[name].css';

module.exports = merge(environment.toWebpackConfig(), customConfig);
