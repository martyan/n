const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')
const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withImages = require('next-images')

module.exports = withImages(withSass(withCss({
    webpack: (config, options) => {
        config.plugins.push(new webpack.EnvironmentPlugin(localEnv))

        return config
    },
    distDir: '../../dist/functions/next'
})))
