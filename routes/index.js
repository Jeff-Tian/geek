var config = require('../config/config.js');

function renderEJS2Jade(req, res, next) {
    res.render('index.jade', {
        cdn: config.cdn,
        title: 'Convert EJS/Html code to jade/pug'
    });
}

module.exports = require('express').Router()
    .get('/', renderEJS2Jade)
    .get('/ejs2jade', renderEJS2Jade)
    .get('/html2jade', renderEJS2Jade)
    .get('/the-ejs2jade.js', function (req, res, next) {
        var fs = require('fs');
        var ejs2jade = fs.readFileSync(__dirname + '/../tools/ejs2jade.js', 'utf-8');
        var js = ejs2jade.toString();

        res.setHeader("Content-Type", "text/javascript; charset=utf-8");
        res.send(js);
    })
;