const merge = require('webpack-merge')
const environment = require('./environment')

const customConfig = {
    output: {
        filename: '[name].bundle.js'
    }
};
module.exports = merge(environment.toWebpackConfig(), customConfig)
