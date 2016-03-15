var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

app.set('port', (process.env.PORT || 60002));

app.all('*', function (req, res, next) {
    res.send('works!');
});

app.listen(app.get('port'), function () {
    console.log('geek application is running on port ', app.get('port'));
});