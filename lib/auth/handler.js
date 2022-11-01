const _ = require('lodash')
const bcrypt = require('bcrypt')
const SALT = 10
const { parse, HttpStatusError, raw } = require('sequelize-handlers')
const { generateTokens } = require('./jwt')
module.exports = class ModelHandler {
  constructor(model, token) {
    this.model = model
    this.token = token
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
        res.status(404).send('missing name || email || password')
      }
    }

    return [raw, handle]
  }
  get() {
    const handle = (req, res, next) => {
      const options = parse(req, this.model)
      console.log('GOING TO GET USER', options)
      this.model.findOne(options).then(respond).catch(next)
      function respond(row) {
        console.log('RAW ROW', row)
        if (!row) {
          throw new HttpStatusError(404, 'Not Found')
        }
        const user = res.transform(row)
        delete user.password
        res.status(200)
        res.send(user)
      }
    }

    return [raw, handle]
  }
  login() {
    const handle = async (req, res, next) => {
      const { email, password } = req.body
      if (!email || !password) {
        res.status(404).send('missing email || password')
      }
      const user = await this.model.findOne({ where: { email } })

      console.log('got user', user)
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        res.status(400).send('email || password are incorrect')
      }
      const { accessToken, refreshToken } = generateTokens(user)

      //set in token model
      await this.token.create({
        token: refreshToken,
        authId: user.id,
      })

      delete user.password

      res.cookie('refresh_token', refreshToken)

      res.status(200).send({
        access_token: accessToken,
        user,
      })
    }
    return handle
  }
  logout() {}
}
