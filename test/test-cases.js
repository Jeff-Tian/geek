var assert = require('assert');
var fs = require('fs');
var ejs2jade = require('../tools/ejs2jade');

var baseDir = __dirname;

function testFilesWithExtension(ext) {
    var files = fs.readdirSync(baseDir + '/cases/');
    files = files.filter(function (fileName) {
        return fileName.indexOf(ext) >= 0;
    }).map(function (f) {
        return f.substr(0, f.indexOf(ext));
    });

    for (var i = 0; i < files.length; i++) {
        var input = fs.readFileSync(baseDir + '/cases/' + files[i] + ext);
        var expected = fs.readFileSync(baseDir + '/cases/' + files[i] + '.jade');

        var res = ejs2jade.convert(input.toString());

        fs.writeFileSync(baseDir + '/cases/' + files[i] + '.output.jade', res.jade);

        assert.equal(expected.toString(), res.jade.replace(/\t/g, '    '));
        assert.deepStrictEqual([], res.errors);
    }
}
describe('test cases', function () {
    it('tests all cases', function () {
        testFilesWithExtension('.html');

        testFilesWithExtension('.ejs');
    });
});