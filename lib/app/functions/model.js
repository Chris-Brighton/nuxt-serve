module.exports = (name) => {
  return app.get('sequelize').models[name]
}
