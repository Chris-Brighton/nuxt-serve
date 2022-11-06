module.exports = (model) => {
  return async (request, response) => {
    const { files } = request
    if (!files || Object.keys(files).length === 0) {
      return response.status(400).send('No files were uploaded.')
    }
    try {
      const file = req.files.file
      const ext = /(?:\.([^.]+))?$/.exec(file.name)[1]
      const uts = new Date().getTime().toString()
      await file.mv(`${process.env.PWD}/static/uploads/${uts}.${ext}`)
      const { dataValues: upload } = await model.create({
        name: file.name,
        path: `/uploads/${uts}.${ext}`,
      })
      return response.status(200).send(upload)
    } catch (exception) {
      return response.status(404).send({
        message: 'Error saving file',
        exception: exception.toString(),
      })
    }
  }
}
