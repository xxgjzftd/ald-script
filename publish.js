const fs = require('fs-extra')

fs.copySync(
  'dist',
  'wwwroot', {
    filter(src) {
      return src === 'dist' || src.endsWith('exe') || src.endsWith('yml') || src.endsWith('yaml')
    }
  }
)