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
  plugins: [require('@tailwindcss/forms')],
};
