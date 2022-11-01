const ModelHandler = require('./handler')

module.exports = class AuthService {
  constructor(name = null, model = null) {
    ;(this.name = name !== null ? name : 'auth'),
      (this.model = model !== null ? model : require('./model')(app))
  }

  configure(app) {
    if (this.model) {
      const handler = new ModelHandler(this.model)
      app.post(`/${this.name}/user`, handler.create())
      app.get(`/${this.name}/user`, handler.user())
      // app.post(`/${this.name}/login`, handler.login())
      // app.post(`/${this.name}/logout`, handler.logout())
    }
    app.set(`[SERVICE:${this.name}]`, this)
    app.logServiceCreated(this.name)
  }
}
