const parse = require('../parse')
const { unlink } = require('fs')

module.exports = class UploadHandler {
  constructor(model, defaults = { limit: 50, offset: 0 }) {
    this.model = model
    this.defaults = defaults
  }

  async create(request, response) {
    try {
      const { files } = request
      if (!files || Object.keys(files).length === 0) {
        return res.status(400).send('No file was uploaded.')
      }
      const file = req.files.file
      const ext = /(?:\.([^.]+))?$/.exec(file.name)[1]
      const uts = new Date().getTime().toString()
      await file.mv(`${process.env.PWD}/static/uploads/${uts}.${ext}`)
      const created = await this.model.create({
        name: file.name,
        path: `/uploads/${uts}.${ext}`,
      })
      console.log('created', created)
      request.status(200).send(created)
    } catch (exception) {
      response.status(400).send({
        message: 'Error uploading file',
        exception,
      })
    }
  }

  async get(request, response) {
    try {
      const { params, options } = request
      const query = _.merge(parse(params, this.model), options)
      const data = await this.model.findOne(query)
      console.log('get', data)
      response.status(200).send(data)
    } catch (exception) {
      response.status(400).send({
        message: 'Error getting record',
        exception,
      })
    }
  }

  async find(request, response) {
    try {
      const { params, options } = request
      const query = _(parse(params, this.model))
        .defaults(this.defaults)
        .merge(options)
        .value()
      const { rows, count: total } = await this.model.findAndCountAll(query)
      console.log('find', rows, total)
      const start = query.offset
      const end = Math.min(count, query.offset + query.limit)
      response.set('Content-Range', `${start}-${end}/${total}`)
      response.status(200).send({ rows, total })
    } catch (exception) {
      response.status(400).send({
        message: 'Error finding record',
        exception,
      })
    }
  }

  async remove(request, response) {
    try {
      const { id } = request.params
      const file = await this.model.findByPk(id)
      const path = `${process.env.PWD}/static${file.path}`
      await unlink(path)
      const result = await this.model.destroy({ where: { id } })
      return res.status(200).send({ deleted: true, id, result })
    } catch (exception) {
      response.status(400).send({
        message: 'Error removing file',
        exception,
      })
    }
  }
}
