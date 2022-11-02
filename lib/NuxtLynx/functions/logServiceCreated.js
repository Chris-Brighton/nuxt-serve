const getRoute = (r) => {
  const { path, methods } = r.route
  const route = `/api${path}`
  let method = ''
  if (methods.post) {
    method = 'POST'
  } else if (methods.get) {
    method = 'GET'
  } else if (methods.delete) {
    method = 'DELETE'
  } else {
    method = 'PUT'
  }
  return `${method} ${route}`
}

module.exports = (name) => {
  const messages = [`Created Service: ${name}`]
  app._router.stack.forEach(function (r) {
    if (
      r.route &&
      r.route.path &&
      (r.route.path == '/' + name ||
        r.route.path === '/' + name + '/:id' ||
        r.route.path.startsWith('/' + name + '/'))
    ) {
      messages.push(`route: ${getRoute(r)}`)
    }
  })
  messages.push('--------------------------------------------------')
  for (let i = 0; i < messages.length; i++) {
    app.logger.info(messages[i])
  }
}
