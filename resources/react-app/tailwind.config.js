const plugin = require('tailwindcss/plugin');

const addColumnCount = plugin(function ({ addUtilities }) {
  let utility = {};
  const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  count.forEach(
    (number) =>
      (utility[`.col-count-${number}`] = {
        'column-count': number,
      })
  );
  addUtilities(utility, ['responsive']);
});

module.exports = {
  theme: {
    extend: {
      minWidth: (theme) => theme('width'),
    },
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last'],
    },
  },
  plugins: [require('@tailwindcss/forms'), addColumnCount],
};
