const upload = require('./upload')
const user = require('./user')
module.exports = (app) => {
  app.configure(upload)
  app.configure(user)
}
