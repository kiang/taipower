var page = require('webpage').create();
page.viewportSize = { width: 1280, height: 1024 };
page.open('http://localhost/~kiang/taipower/code1/print/', function() {
  page.render('github.png');
  phantom.exit();
});
