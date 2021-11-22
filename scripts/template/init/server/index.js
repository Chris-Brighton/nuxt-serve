const { NuxtServe } = require('nuxt-serve')
const services = require('./services')
const Sequelize = require('sequelize')

const nuxtServe = new NuxtServe()
nuxtServe.sequelize(
  new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: `${process.env.PWD}/database.sqlite`,
    query: {
      raw: true,
    },
    define: {
      freezeTableName: true,
      underscored: false,
      createdAt: true,
      updatedAt: true,
    },
  })
)
const app = nuxtServe.app()
app.configure(services)
app.start()
export default {
  path: '/api',
  handler: app,
}
