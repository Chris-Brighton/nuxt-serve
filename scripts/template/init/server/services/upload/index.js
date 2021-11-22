const { UploadService } = require('nuxt-serve')
module.exports = (app) => {
  new UploadService(app).configure(app)
}
