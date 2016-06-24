var test = require('./prepare');

describe('ignore html comments', function () {
    it('ignores html comments', function () {
        test(
            '<!-- ejs2pug -->',
            '//(ejs2pug="", --="")'
        );
    });
});