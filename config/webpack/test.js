process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')
environment.config.set('output.filename', '[name].js')

const extractText = environment.plugins.get('ExtractText');
extractText.filename = '[name].css';

module.exports = environment.toWebpackConfig()
