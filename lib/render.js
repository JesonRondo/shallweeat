var mu = require('mu2');

var r = function *(tpl, data) {
  function rd() {
    return function(next) {
      var str = '';
      mu
        .compileAndRender(tpl, data)
        .on('data', function(strline) {
          str += strline;
        })
        .on('end', function() {
          next(null, str);
        });
    }
  }

  var ret = yield rd();
  return ret;
};

var render = function *(tpl, data) {
  var res = yield r(tpl, data);
  return res.toString();
};

module.exports = render;
