function isObject(objValue) {
  return (
    objValue && typeof objValue === 'object' && objValue.constructor === Object
  )
}

function typeOf(item) {
  if (typeof item === 'function') return 'function'
  else if (isObject(item)) return 'object'
  else return null
}

function setObject(app, object) {
  for (const key in object) {
    app.set(key, object[key as keyof typeof object])
  }
}

module.exports = (app) => {
  /**
   * @param {Object|function} item - the item you want to configure
   */
  return function (item) {
    switch (typeOf(item)) {
      case 'function':
        item(app)
        break
      case 'object':
        setObject(app, item)
      default:
        break
    }
  }
}
