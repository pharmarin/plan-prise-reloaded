module.exports = {
  purge: [
    'resources/react-app/src/**/*.js',
    'resources/react-app/src/**/*.jsx',
    'resources/react-app/src/**/*.ts',
    'resources/react-app/src/**/*.tsx',
    'resources/react-app/public/**/*.html',
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
