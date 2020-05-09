/* eslint-disable import/no-extraneous-dependencies */
const mix = require('laravel-mix');
require('laravel-mix-artisan-serve');
require('laravel-mix-polyfill');

mix.webpackConfig({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
});

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

mix
  .js('resources/js/app.jsx', 'public/js')
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
    'react-redux',
  ])
  .autoload({
    jquery: ['$', 'window.jQuery', 'jQuery', 'jquery'],
  });

if (mix.inProduction()) mix.version();
if (!mix.inProduction()) mix.serve();
