const ModelHandler = require('../handlers/ModelHandler')
const parse = require('../parse')
const _ = require('lodash')
const { create, update, get, find, remove } = require('../handlers')

module.exports = class Service {
  constructor(name, model = null, paginate = { limit: 50 }) {
    this.name = name
    this.model = model
    this.paginate = paginate
    this.paginate.offset = 0
    this.routes = []
  }

  /**
   *
   * @param {String} type get, post, put, remove, etc...
   * @param {String} route ':/id', '', '/custom/:id'
   * @param {Function} asyncFunc async function(req, res, next)
   */
  addRoute(type, route, asyncFunc) {
    this.routes.push({ type, route, asyncFunc })
  }

  /**
   * @private
   * @param {Object} app
   */
  _buildRoutes(app) {
    for (let i = 0; i < this.routes.length; i++) {
      const { type, route, asyncFunc } = this.routes[i]
      app[type](`/${this.name}${route}`, asyncFunc)
    }
  }

  /**
   * @description Consfigure the service and attach routes to express app
   * @param {Object} app
   */
  configure(app) {
    this._buildRoutes(app)
    const { model } = this
    if (this.model) {
      app.post(`/${this.name}`, create(model))
      app.get(`/${this.name}/:id`, get(model))
      app.get(`/${this.name}`, find(model, this.paginate))
      app.delete(`/${this.name}/:id`, remove(model))
      app.put(`/${this.name}/:id`, update(model))
      app.set(`[SERVICE:${this.name}]`, this)
      app.logServiceCreated(this.name)
    } else {
      throw new Error(`There is no model to configure the ${this.name} with`)
    }
  }

  /**
   * @description Parse request params
   * @param {Object} req express req object
   * @returns {Object} sequelize ready query
   */
  parse(req) {
    return _.merge(parse(req.params, this.model), req.options)
  }

  async find(query) {
    return await this.model.findAndCountAll(query)
  }

  async get(id) {
    return await this.model.findOne({ where: { id } })
  }

  async update(id, data) {
    await this.model.update(data, { where: { id } })
    return this.model.findOne({ where: { id } })
  }

  async remove(id) {
    const row = await this.model.findOne({ where: { id } })
    if (row) {
      return await this.model.destroy({ where: { id } })
    } else {
      throw 'Not Found'
    }
  }

  async findOne(query) {
    return await this.model.findOne(query)
  }
}
