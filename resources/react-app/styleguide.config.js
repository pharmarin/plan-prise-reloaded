const path = require('path');

module.exports = {
  components: 'src/base-components/**/*.tsx',
  defaultExample: true,
  require: [path.join(__dirname, 'src/styles.css')],
};
