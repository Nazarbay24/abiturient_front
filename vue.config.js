module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  publicPath: "/portal",
  outputDir: "portal",

  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'ru',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
