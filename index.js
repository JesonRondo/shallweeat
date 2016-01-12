var serve = require('koa-static');
var path = require('path');
var koa = require('koa');
var fs = require('co-fs');

var render = require('./lib/render');

var app = koa();

app.use(serve(path.join(__dirname, 'static')));

app.use(function *() {
  var shops = yield fs.readFile(path.join(__dirname, 'static', 'shop.json'));
  shops = JSON.parse(shops);

  var cnt = yield render(path.join(__dirname, 'index.html'), {
    shops: shops,
    shops_json: JSON.stringify(shops)
  });

  this.type = 'text/html; charset=utf-8';
  this.body = cnt;
});

app.listen(3117);
