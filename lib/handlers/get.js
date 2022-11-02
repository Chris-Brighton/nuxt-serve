const _ = require('lodash')
const parse = require('../parse')

module.exports = (model) => {
  return async (request, response) => {
    try {
      const { params, options } = request
      const query = _.merge(parse(params, model), options)
      const data = await model.findOne(query)
      return response.status(200).send(data)
    } catch (exception) {
      return response.status(400).send({
        message: 'Error getting record',
        exception: exception.toString(),
      })
    }
  }
}
