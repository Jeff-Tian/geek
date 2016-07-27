var test = require('./prepare');
var fs = require('fs');

var baseDir = __dirname;

describe('test cases', function () {
    it('tests all cases', function () {
        var input = fs.readFileSync(baseDir + '/cases/doctype.html');
        var expected = fs.readFileSync(baseDir + '/cases/doctype.jade');

        test(input.toString(), expected.toString());
    });
});