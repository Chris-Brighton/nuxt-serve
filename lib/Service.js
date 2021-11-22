const { ModelHandler } = require('sequelize-handlers')
module.exports = class Service {
  constructor(name, model, paginate = null) {
    ;(this.name = name), (this.model = model), (this.paginate = paginate)
    this.handler = new ModelHandler(model, { limit: 10, offset: 0 })
  }
  configure(app) {
    app.post(`/${this.name}`, this.handler.create())
    app.get(`/${this.name}/:id`, this.handler.get())
    app.get(`/${this.name}`, this.handler.query())
    app.delete(`/${this.name}/:id`, this.handler.remove())
    app.put(`/${this.name}/:id`, this.handler.update())
    app.set(`[SERVICE:${this.name}]`, this)
    app.logger.info(`Created Service: ${this.name}`)
  }
}
