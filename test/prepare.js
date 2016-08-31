var assert = require('assert');
var ejs2jade = require('../tools/ejs2jade');

function test(ejs, expectedJade) {
    var res = ejs2jade.convert(ejs);
    assert.equal(expectedJade, res.jade.replace(/\t/g, '    '));
    assert.deepStrictEqual([], res.errors);
}

module.exports = test;