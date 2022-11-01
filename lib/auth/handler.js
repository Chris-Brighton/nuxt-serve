const _ = require('lodash')
const bcrypt = require('bcrypt')
const SALT = 10
const { parse, HttpStatusError, raw } = require('sequelize-handlers')
module.exports = class ModelHandler {
  constructor(model) {
    this.model = model
  }

  parse(req) {
    return _.merge(parse(req.params, this.model), req.options)
  }

  create() {
    const handle = (req, res, next) => {
      const { name, email, password } = req.body
      if (name && email && password) {
        bcrypt.hash(password, SALT, (err, hash) => {
          if (!err) {
            const createUser = {
              name,
              email,
              password: hash,
            }
            this.model
              .create(createUser)
              .then((row) => {
                const { dataValues } = res.transform(row)
                delete dataValues.password
                res.send(dataValues)
              })
              .catch(next)
          }
        })
      } else {
        res.sendStatus(500)
      }
    }

    return [raw, handle]
  }
  get() {
    const handle = (req, res, next) => {
      const options = parse(req.params, this.model)
      console.log('GOING TO GET USER', options)
      this.model.findOne(options).then(respond).catch(next)
      function respond(row) {
        console.log('RAW ROW', row)
        if (!row) {
          throw new HttpStatusError(404, 'Not Found')
        }
        const user = res.transform(row)
        console.log('TRANSFORMED ROW', user)
        delete user.password
        console.log('RETURNING TO FRONTEND', user)
        res.status(200)
        res.send(user)
      }
    }

    return [raw, handle]
  }
  login() {}
  logout() {}
}
