/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , fs = require('fs')
  , nib = require('nib');

var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname);// + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
app.use(express.logger('  \033[90m:method\033[0m \033[36m:url\033[0m \033[90m:response-time\033[0m'));

// app.use(express.bodyParser());
// app.use(express.methodOverride());


app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  );
});
app.get('/:file', function(req, res, next){
  var fn = req.params.file;
  if (fn.indexOf('html')) {
    fn = fn.replace('.html','.jade');
  }
  var path = __dirname + '/' + fn;
  if (fs.existsSync(path)) {
    if (path.indexOf('jade')) {
      res.render(path);
    }
  } else {
    next();
  }
});

app.get('/weixinwall', function(req, res){
  res.render('weixinwall/index.jade');
});
app.get('/weixinwall/settings/208', function(req, res){
  res.render('weixinwall/settings.jade');
});
app.get('/weixinwall/208', function(req, res){
  res.render('weixinwall/wall.jade');
});
app.get('/weixinwall/:param', function(req, res){
  res.render('weixinwall/' + req.params.param);
});

app.use(express.static(__dirname));
app.listen(3000);