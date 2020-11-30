const path = require('path');

module.exports = {
  components: 'src/base-components/**/*.tsx',
  defaultExample: true,
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json'
  ).parse,
  require: [path.join(__dirname, 'src/styles.css')],
};
