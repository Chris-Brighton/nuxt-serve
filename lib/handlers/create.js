module.exports = (model) => {
  return async (request, response) => {
    try {
      const { body: create } = request
      const { dataValues: created } = await model.create(create)
      console.log('created', created)
      response.status(200).send(created)
    } catch (exception) {
      response.status(400).send({
        message: 'Error creating record',
        exception: exception.toString(),
      })
    }
  }
}
