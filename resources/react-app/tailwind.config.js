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
      height: {
        'view-50': '50vh',
        'view-75': '75vh',
        'view-80': '80vh',
        'view-90': '90vh',
        'view-95': '95vh',
      },
      minWidth: (theme) => theme('width'),
    },
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last'],
      borderWidth: ['last'],
    },
  },
  plugins: [require('@tailwindcss/forms'), addColumnCount],
};
