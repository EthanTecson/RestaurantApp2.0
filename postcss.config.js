// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')() // Include this if you want to use cssnano for minification as part of PostCSS
  ]
};