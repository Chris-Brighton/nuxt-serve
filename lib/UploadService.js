const fileUpload = require('express-fileupload')
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes
const { ModelHandler } = require('sequelize-handlers')

module.exports = class UploadService {
  constructor(name, model) {
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

  configure(app) {
    app.use(fileUpload())
    app.post(`/${this.name}`, this._saveFile())
    app.get(`/${this.name}/:id`, this.handler.get())
    app.get(`/${this.name}`, this.handler.query())
    //app.delete(`/${this.name}/:id`, this.handler.remove());
    app.set(`[SERVICE:${this.name}]`, this)
    app.logServiceCreated(this.name)
  }
}
