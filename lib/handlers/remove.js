module.exports = (model) => {
  return async (request, response) => {
    try {
      const {
        params: { id },
      } = request
      const done = await model.destroy({ where: { id } })
      if (done) {
        return response.status(200).send({ removed: true })
      } else {
        return response.status(400).send({
          message: 'Error removing record',
          removed: false,
        })
      }
    } catch (exception) {
      return response.status(400).send({
        message: 'Error removing record',
        exception: exception.toString(),
      })
    }
  }
}
