const { unlink } = require('fs')

module.exports = (model) => {
  return async (request, response) => {
    const { id } = request.params
    if (!id) return response.status(400).send('No file id')
    try {
      const file = await model.findOne({ where: { id } })
      const path = `${process.env.PWD}/static${file.path}`
      await unlink(path)
      await this.model.destroy({ where: { id } })
      return response.status(200).send({ removed: true })
    } catch (exception) {
      return response.status(400).send({
        message: 'Error removing file',
        exception: exception.toString(),
      })
    }
  }
}
