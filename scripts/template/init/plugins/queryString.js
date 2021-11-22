function queryString(query) {
  const string = []
  Object.keys(query).forEach((key) => {
    string.push(
      `key=${
        typeof query[key] === 'string' ? query[key] : JSON.stringify(query[key])
      }`
    )
  })
  return '?' + string.join('&')
}

export default ({ app }, inject) => {
  inject('queryString', queryString)
}
