module.exports = (name) => {
  return app.get(`[SERVICE:${name}]`)
}
