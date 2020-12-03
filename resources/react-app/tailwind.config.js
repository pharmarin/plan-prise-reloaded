module.exports = {
  purge: [
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './public/**/*.html',
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last'],
      borderColor: ['important'],
      fontSize: ['important'],
      fontStyle: ['important'],
      fontWeight: ['important'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@neojp/tailwindcss-important-variant'),
  ],
};
