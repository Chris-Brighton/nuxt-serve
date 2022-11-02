const _ = require('lodash')
const parse = require('../parse')

module.exports = (model) => {
  return async (request, response) => {
    try {
      const { params, options } = request
      const query = _.merge(parse(params, this.model), options)
      const data = await model.destroy(query)
      console.log('remove', data)
      return response.status(200).send({ removed: true })
    } catch (exception) {
      return response.status(400).send({
        message: 'Error removing record',
        exception: exception.toString(),
      })
    }
  }
}
