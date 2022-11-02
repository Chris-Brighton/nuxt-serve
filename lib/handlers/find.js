const _ = require('lodash')

module.exports = (model, defaults) => {
  return async (request, response) => {
    try {
      const { params, options } = request
      const query = _(parse(params, model))
        .defaults(defaults)
        .merge(options)
        .value()
      if (query.limit === -1) {
        delete query.limit
        query.offset = 0
      }
      const { rows, count: total } = await model.findAndCountAll(query)
      return response.status(200).send({ rows, total })
    } catch (exception) {
      return response.status(400).send({
        message: 'Error finding record',
        exception: exception.toString(),
      })
    }
  }
}
