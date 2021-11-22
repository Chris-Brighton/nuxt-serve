const express = require('express')
const bodyParser = require('body-parser')
const logger = require('./logger')
const app = express()
app.use(bodyParser.json())
const configure = require('./configure')(app)

const getRoute = (r) => {
  const { path, methods } = r.route
  const route = `/api${path}`
  let method = ''
  if (methods.post) {
    method = 'POST'
  } else if (methods.get) {
    method = 'GET'
  } else if (methods.delete) {
    method = 'DELETE'
  } else {
    method = 'PUT'
  }
  return `${method} ${route}`
}

app.logger = logger
app.configure = configure
app.service = (name) => {
  return app.get(`[SERVICE:${name}]`)
}
app.model = (name) => {
  return app.get('sequelize').models[name]
}
app.start = () => {
  app._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      app.logger.info(`route: ${getRoute(r)}`)
    }
  })
  const sequelize = app.get('sequelize')
  if (sequelize) {
    const models = sequelize.models
    Object.keys(models).forEach((name) => {
      if ('associate' in models[name]) {
        models[name].associate(models)
      }
    })
  }
}

module.exports = app
