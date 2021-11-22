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

function checkPath(path) {
  return fs.existsSync(path)
}

function makeDir(path) {
  if (!checkPath(path)) {
    try {
      fs.mkdirSync(path)
    } catch (ex) {}
  }
}

copyDirectory(
  process.env.PWD + '/node_modules/nuxt-serve/scripts/template/init',
  process.env.PWD
)
makeDir(process.env.PWD + '/static/uploads')
