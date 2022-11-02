const _ = require('lodash')
const parse = require('../parse')

module.exports = (model) => {
  return async (request, response) => {
    try {
      const { params, options, body: update } = request
      const query = _.merge(parse(params, model), options)
      await model.update(update, query)
      const updated = await model.findOne(query)
      console.log('update', updated)
      return response.status(200).send(updated)
    } catch (exception) {
      return response.status(400).send({
        message: 'Error updating record',
        exception: exception.toString(),
      })
    }
  }
}
