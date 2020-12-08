module.exports = {
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
