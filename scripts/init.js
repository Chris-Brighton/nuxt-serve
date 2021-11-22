const fs = require('fs')
const path = require('path')

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true })

  fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
    let sourcePath = path.join(source, entry.name)
    let destinationPath = path.join(destination, entry.name)

    entry.isDirectory()
      ? copyDirectory(sourcePath, destinationPath)
      : fs.copyFileSync(sourcePath, destinationPath)
  })
}

copyDirectory(
  process.env.PWD + '/node_modules/nuxt-serve/scripts/template/init',
  process.env.PWD
)
