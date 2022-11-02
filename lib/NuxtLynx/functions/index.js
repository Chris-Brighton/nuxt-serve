const configureBuilder = require('./configure')
const service = require('./service')
const model = require('./model')
const logServiceCreated = require('./logServiceCreated')
module.exports = (app) => {
  app.configure = configureBuilder(app)
  app.service = service
  app.model = model
  app.logServiceCreated = logServiceCreated
}
