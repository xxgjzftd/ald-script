const fs = require('fs-extra')

fs.copySync(
  'dist',
  'wwwroot', {
    filter(src) {
      return src.endsWith('exe') || src.endsWith('yml')
    }
  }
)