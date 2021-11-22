const fileUpload = require('express-fileupload')
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes
const { ModelHandler } = require('sequelize-handlers')

const model = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}

const options = {
  underscored: false,
  createdAt: false,
  updatedAt: false,
  hooks: {
    beforeCount(options) {
      options.raw = true
    },
  },
}

module.exports = class UploadService {
  constructor(app) {
    this.name = 'upload'
    const sequelize = app.get('sequelize')
    this._defineModel(sequelize)
    this.handler = new ModelHandler(this.model)
  }
  /**
   * @private
   * @param {Object} sequelize
   */
  _defineModel(sequelize) {
    const uploads = sequelize.define('upload', model, options)
    this.model = uploads
  }

  /**
   * @private
   * @returns {function}
   */
  _saveFile() {
    return async (req, res, next) => {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.')
      }
      const ext = /(?:\.([^.]+))?$/.exec(file.name)[1]
      const uts = new Date().getTime().toString()
      const file = req.files.file
      await file.mv(`${process.env.PWD}/static/uploads/${uts}.${ext}`)
      req.data = {
        name: file.name,
        path: `/static/uploads/${uts}.${ext}`,
      }
      next()
    }
  }

  configure(app) {
    app.use(fileUpload())
    app.post(`/${this.name}`, this._saveFile(), this.handler.create())
    // app.get(`/${this.name}/:id`, this.handler.get());
    // app.get(`/${this.name}`, this.handler.query());
    // app.delete(`/${this.name}/:id`, this.handler.remove());
    app.set(`[SERVICE:${this.name}]`, this)
    app.logger.info(`Created Service: ${this.name}`)
  }
}
