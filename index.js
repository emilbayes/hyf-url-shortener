var http = require('http')
var Router = require('./router')
var url = require('url')

var database = []

var router = new Router(function onNotFound (req, res) {
  res.statusCode = 404
  res.statusMessage = http.STATUS_CODES[404]
  res.setHeader('Content-Type', 'text/plain')
  res.end(http.STATUS_CODES[404] + '\n')
})

router.post('/create', function (req, res) {
  var reqUrl = url.parse(req.url, true) // True turns querystring into an object

  // Some light error handling
  if (reqUrl.query.url == null) {
    res.statusCode = 400
    res.statusMessage = http.STATUS_CODES[400]
    res.end()
    return
  }

  // Push returns the new length, hence what we just pushed is at new length - 1
  var idx = database.push(reqUrl.query.url) - 1

  res.setHeader('Content-Type', 'text/plain')
  res.end(`http://localhost:8080/short?index=${idx}\n`)
})

router.get('/short', function (req, res) {
  var reqUrl = url.parse(req.url, true) // True turns querystring into an object
  var idx = parseInt(reqUrl.query.index, 10)
  var redirect = database[idx]
  if (redirect == null) {
    res.statusCode = 404
    res.statusMessage = http.STATUS_CODES[404]
    res.end()
    return
  }

  res.statusCode = 200
  res.statusMessage = http.STATUS_CODES[200]
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Location', redirect)
  res.end(`<html><a href="${redirect}">Redirecting to ${redirect}</a></html>`)
})

var server = http.createServer(function (req, res) {
  router.dispatch(req, res)
})

// PORT > 1024
server.listen(8080)
