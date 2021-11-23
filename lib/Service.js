const { ModelHandler, parse } = require('sequelize-handlers')
const _ = require('lodash')
module.exports = class Service {
  constructor(name, model = null, paginate = { default: 10 }) {
    ;(this.name = name), (this.model = model), (this.paginate = paginate)
  }
  configure(app) {
    if (this.model) {
      const handler = new ModelHandler(this.model, {
        limit: this.paginate.default,
        offset: 0,
      })
      app.post(`/${this.name}`, handler.create())
      app.get(`/${this.name}/:id`, handler.get())
      app.get(`/${this.name}`, handler.query())
      app.delete(`/${this.name}/:id`, handler.remove())
      app.put(`/${this.name}/:id`, handler.update())
    }
    app.set(`[SERVICE:${this.name}]`, this)
    app.logServiceCreated(this.name)
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
