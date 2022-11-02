const express = require('./express')
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes
/** @namespace */
module.exports = class NuxtLynx {
  constructor() {
    this.express = express
  }

  /**
   * @description Create a sequelize instance
   * @param {Object} sequelize - new Sequelize({}) object
   */
  sequelize(sequelize) {
    sequelize.sync().then(() => {
      sequelize
        .authenticate()
        .then(() => {
          this.express.logger.info('Connected to database')
        })
        .catch((err) => {
          this.express.logger.error('Error connecting to database')
        })
    })
    this.express.set('sequelize', sequelize)
    this.express.set('DataTypes', DataTypes)
  }

  app() {
    return this.express
  }
}
