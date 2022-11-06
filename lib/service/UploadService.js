const fileUpload = require('express-fileupload')
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes
const { uploadFile, removeFile, get, find } = require('../handlers')
module.exports = class UploadService {
  constructor(name = 'upload', model = null, paginate = { limit: -1 }) {
    this.name = name
    this.model = model
    this.paginate = paginate
    this.paginate.offset = 0
  }

  configure(app) {
    app.use(fileUpload())
    app.post(`/${this.name}`, uploadFile(this.model))
    app.get(`/${this.name}/:id`, get(this.model))
    app.get(`/${this.name}`, find(this.model, this.paginate))
    app.delete(`/${this.name}/:id`, removeFile(this.model))
    app.set(`[SERVICE:${this.name}]`, this)
    app.logServiceCreated(this.name)
  }
}
