const { Service } = require('nuxt-serve')
const model = require('./model')
module.exports = (app) => {
  new Service('user', model(app)).configure(app)
}
