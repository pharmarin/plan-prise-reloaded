const mix = require('laravel-mix');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

mix.options({
  hmrOptions: {
    host: '192.168.1.15',
    https: true,
    port: 8090,
    disableHostCheck: true,
    useLocalIp: true
  }
})

/*mix.browserSync({
  open: false,
  proxy: 'https://pharmarin.dynamic-dns.net',
  https: {
    key: "/etc/letsencrypt/live/pharmarin.dynamic-dns.net/privkey.pem",
    cert: "/etc/letsencrypt/live/pharmarin.dynamic-dns.net/cert.pem"
  }
})*/

/*
|--------------------------------------------------------------------------
| Mix Asset Management
|--------------------------------------------------------------------------
|
| Mix provides a clean, fluent API for defining some Webpack build steps
| for your Laravel application. By default, we are compiling the Sass
| file for the application as well as bundling up all the JS files.
|
*/

mix.js('resources/js/app.js', 'public/js')
  .react('resources/js/medicament.js', 'public/js')
  .react('resources/js/medicament-update.js', 'public/js')
  .react('resources/js/plan-prise.js', 'public/js')
  .sass('resources/sass/app.scss', 'public/css')
  .extract([
   'react',
    'react-dom',
    'react-overlays',
    'jquery',
    'axios',
    'popper.js',
    'lodash',
    'pdfmake',
    'react-bootstrap',
    'redux',
    'react-redux'
  ])
  .autoload({
    jquery: ['$', 'window.jQuery', 'jQuery', 'jquery'],
  })
  .version()
  //.sourceMaps() //To high RAM usage
  /*
  .webpackConfig({
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerHost: '192.168.1.15',
        analyzerPort: 8383
      })
    ],
  })
  */;
