const parse = require('../parse')
const _ = require('lodash')

module.exports = class ModelHandler {
  constructor(model, defaults = { limit: 50, offset: 0 }) {
    this.model = model
    this.defaults = defaults
  }

  create(model) {
    return async (request, response) => {
      try {
        const { body: create } = request
        const { dataValues: created } = await model.create(create)
        console.log('created', created)
        response.status(200).send(created)
      } catch (exception) {
        response.status(400).send({
          message: 'Error creating record',
          exception: exception.toString(),
        })
      }
    }
  }

  get(model) {
    return async (request, response) => {
      try {
        const { params, options } = request
        const query = _.merge(parse(params, model), options)
        const data = await model.findOne(query)
        console.log('get', data)
        response.status(200).send(data)
      } catch (exception) {
        response.status(400).send({
          message: 'Error getting record',
          exception: exception.toString(),
        })
      }
    }
  }

  find(model) {
    const defaults = this.defaults
    return async (request, response) => {
      try {
        const { params, options } = request
        const query = _(parse(params, model))
          .defaults(defaults)
          .merge(options)
          .value()
        const { rows, count: total } = await model.findAndCountAll(query)
        console.log('find', rows, total)
        const start = query.offset
        const end = Math.min(total, query.offset + query.limit)
        response.set('Content-Range', `${start}-${end}/${total}`)
        response.status(200).send({ rows, total })
      } catch (exception) {
        response.status(400).send({
          message: 'Error finding record',
          exception: exception.toString(),
        })
      }
    }
  }

  update(model) {
    return async (request, response) => {
      try {
        const { params, options, body: update } = request
        const query = _.merge(parse(params, model), options)
        await model.update(update, query)
        const updated = await model.find(query)
        console.log('update', updated)
        response.status(200).send(updated)
      } catch (exception) {
        response.status(400).send({
          message: 'Error updating record',
          exception: exception.toString(),
        })
      }
    }
  }

  remove(model) {
    return async (request, response) => {
      try {
        const { params, options } = request
        const query = _.merge(parse(params, this.model), options)
        const data = await model.destroy(query)
        console.log('remove', data)
        response.status(200).send({ removed: true })
      } catch (exception) {
        response.status(400).send({
          message: 'Error removing record',
          exception: exception.toString(),
        })
      }
    }
  }
}
