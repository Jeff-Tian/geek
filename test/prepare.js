var assert = require('assert');
var ejs2jade = require('../tools/ejs2jade');

function test(ejs, expectedJade, replaceTab) {
    var res = ejs2jade.convert(ejs);
    var actual = replaceTab ? res.jade.replace(/\t/g, '    ') : res.jade;
    assert.equal(expectedJade, actual);
    assert.deepStrictEqual([], res.errors);
}

module.exports = test;