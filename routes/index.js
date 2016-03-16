var config = require('../config/config.js');

module.exports = require('express').Router()
    .get('/ejs2jade', function (req, res, next) {
        res.render('index.jade', {
            cdn: config.cdn,
            title: 'Convert EJS code to jade'
        });
    })
;