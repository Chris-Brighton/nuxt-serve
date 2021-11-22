const express = require('./express')
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes
/** @namespace */
module.exports = class NuxtServe {
  constructor() {
    this.express = express
  }

  /**
   * @description Create a sequelize instance
   * @param {string|Object} database database name (string) database config (object)
   * @param {string} [user] database username
   * @param {string} [password] database password
   * @param {string} [options] database options
   */
  sequelize(database, user = null, password = null, options = null) {
    let sequelize = null
    if (
      typeof database === 'string' &&
      typeof user === 'string' &&
      typeof password === 'string' &&
      typeof options === 'object'
    ) {
      sequelize = new Sequelize(database, user, password, options)
    } else {
      sequelize = new Sequelize(database)
    }
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
    this.database = sequelize
    this.express.set('sequelize', sequelize)
    this.express.set('DataTypes', DataTypes)
  }

  app() {
    return this.express
  }
}
