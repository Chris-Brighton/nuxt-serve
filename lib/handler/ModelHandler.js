const parse = require('../parse')

module.exports = class ModelHandler {
  constructor(model, defaults = { limit: 50, offset: 0 }) {
    this.model = model
    this.defaults = defaults
  }

  async create(request, response) {
    try {
      const { body } = request

      const created = await this.model.create(body)
      console.log('created', created)
      response.status(200).send(created)
    } catch (exception) {
      response.status(400).send({
        message: 'Error creating record',
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

  async update(request, response) {
    try {
      const { params, options, body: update } = request
      const query = _.merge(parse(params, this.model), options)
      await model.update(update, query)
      const updated = await model.find(query)
      console.log('update', updated)
      response.status(200).send(updated)
    } catch (exception) {
      response.status(400).send({
        message: 'Error updating record',
        exception,
      })
    }
  }

  async remove(request, response) {
    try {
      const { params, options } = request
      const query = _.merge(parse(params, this.model), options)
      const data = await model.destroy(query)
      console.log('remove', data)
      response.status(200).send({ removed: true })
    } catch (exception) {
      response.status(400).send({
        message: 'Error removing record',
        exception,
      })
    }
  }
}
