const fileUpload = require('express-fileupload')
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes
const { ModelHandler } = require('sequelize-handlers')
const { unlink } = require('fs')
module.exports = class UploadService {
  constructor(name = 'upload', model = null) {
    this.name = name
    this.model = model
    this.handler = new ModelHandler(this.model)
  }

  /**
   * @private
   * @returns {function}
   */
  _saveFile() {
    const upload = this.model
    return async (req, res, next) => {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.')
      }
      try {
        const file = req.files.file
        const ext = /(?:\.([^.]+))?$/.exec(file.name)[1]
        const uts = new Date().getTime().toString()
        await file.mv(`${process.env.PWD}/static/uploads/${uts}.${ext}`)
        const result = await upload.create({
          name: file.name,
          path: `/uploads/${uts}.${ext}`,
        })
        return res.send(result)
      } catch (ex) {
        return res.status(402).send(ex)
      }
    }
  }

  _removeFile() {
    const upload = this.model
    return async (req, res, next) => {
      const { id } = req.params
      const file = await this.model.findOne({ where: { id } })
      if (file) {
        const path = `${process.env.PWD}/static${file.path}`
        try {
          await unlink(path)
          const result = await this.model.destroy({ where: { id } })
          return res.send(result)
        } catch (ex) {
          return res.status(402).send(ex)
        }
      } else {
        return res.status(404).send('File Not Found')
      }
    }
  }

  configure(app) {
    app.use(fileUpload())
    app.post(`/${this.name}`, this._saveFile())
    app.get(`/${this.name}/:id`, this.handler.get)
    app.get(`/${this.name}`, this.handler.find)
    app.delete(`/${this.name}/:id`, this._removeFile())
    app.set(`[SERVICE:${this.name}]`, this)
    app.logServiceCreated(this.name)
  }
}
