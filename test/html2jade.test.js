var test = require('./prepare');

describe('html to jade', function () {
    it('converts html to jade', function () {
        test('<p>test</p>', 'p\n\t| test');
    });
});