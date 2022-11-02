const express = require('express')
const bodyParser = require('body-parser')
const logger = require('./logger')
const functions = require('./functions')
const app = functions(express())
app.use(bodyParser.json())
app.logger = logger

app.start = () => {
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
