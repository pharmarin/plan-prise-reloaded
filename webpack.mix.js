const mix = require('laravel-mix');
require('laravel-mix-artisan-serve');
require('laravel-mix-polyfill');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/*mix.options({
  hmrOptions: {
    host: '127.0.0.1',
    port: 8080,
    disableHostCheck: true,
    useLocalIp: true
  }
})*/

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
  .polyfill()
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
  /*
  .webpackConfig({
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerHost: '192.168.1.15',
        analyzerPort: 8383
      })
    ],
  })
  */
  .serve()
