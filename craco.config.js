module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => ({
            ...webpackConfig,
            entry: {
                main: [env === 'development' &&
                    require.resolve('webpack/hot/dev-server'), paths.appIndexJs].filter(Boolean),
                content: './src/services/chrome',
                background: './src/background/index',

            },
            output: {
                ...webpackConfig.output,
                filename: 'static/js/[name].js',
            },
            optimization: {
                ...webpackConfig.optimization,
                /* 
                   runtimeChunk: false, */
                runtimeChunk: false,
                splitChunks: {
                    chunks(chunk) {
                        return false
                    },
                },
            }
        }),
    }
}
