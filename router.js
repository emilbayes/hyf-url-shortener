const http = require('http')
const url = require('url')

class Router extends Map {
  constructor (notFoundFn) {
    if (typeof notFoundFn !== 'function') throw new Error('notFoundFn must be function')

    super()
    this.notFoundFn = notFoundFn
  }

  get (path, fn) {
    return this.add('GET', path, fn)
  }

  post (path, fn) {
    return this.add('POST', path, fn)
  }

  put (path, fn) {
    return this.add('PUT', path, fn)
  }

  delete (path, fn) {
    return this.add('DELETE', path, fn)
  }

  head (path, fn) {
    return this.add('HEAD', path, fn)
  }

  add (method, path, fn) {
    if (typeof path !== 'string') throw new Error('path must be string')
    if (typeof fn !== 'function') throw new Error('fn must be function')

    super.set(method + ' ' + path, fn)
  }

  dispatch (req, res) {
    if (!(req instanceof http.IncomingMessage)) throw new Error('req must be IncomingMessage')
    if (!(res instanceof http.ServerResponse)) throw new Error('req must be ServerReponse')

    const reqUrl = url.parse(req.url, true)

    if (super.has(req.method + ' ' + reqUrl.pathname)) {
      var handlerFn = super.get(req.method + ' ' + reqUrl.pathname)
      handlerFn(req, res)
      return
    } else {
      this.notFoundFn(req, res)
    }
  }
}

module.exports = Router
