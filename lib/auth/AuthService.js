const ModelHandler = require('./handler')
const createAuthModel = require('./auth.model')
const createTokenModel = require('./token.model')
module.exports = class AuthService {
  constructor() {
    this.name = 'auth'
    this.model = {
      auth: createAuthModel(app),
      token: createTokenModel(app),
    }
  }

  configure(app) {
    if (this.model) {
      const handler = new ModelHandler(this.model.auth, this.model.token)
      app.post(`/${this.name}/user`, handler.create())
      app.get(`/${this.name}/user`, handler.get())
      app.post(`/${this.name}/login`, handler.login())
      // app.post(`/${this.name}/logout`, handler.logout())
    }
    app.set(`[SERVICE:${this.name}]`, this)
    app.logServiceCreated(this.name)
  }
}
