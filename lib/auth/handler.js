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
            console.log('GOING TO CREATE USER', createUser)
            this.model
              .create(createUser)
              .then((row) => {
                console.log('RAW ROW', row)
                const user = res.transform(row)
                console.log('TRANSFORMED ROW', user)
                delete user.password
                console.log('RETURNING TO FRONTEND', user)
                res.send(200)
                res.send(user)
              })
              .catch(next)
          }
        })
      } else {
        res.send(500)
        res.send({ error: 'missing one of name, email, password' })
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
