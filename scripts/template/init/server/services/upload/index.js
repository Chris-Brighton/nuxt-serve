const { UploadService } = require('nuxt-serve')
const model = require('./model')
module.exports = (app) => {
  new UploadService('upload', model(app)).configure(app)
}
