var test = require('./prepare');

describe('ignore html comments', function () {
    it('ignores html comments', function () {
        test(
            '<!-- ejs2pug -->',
            ''
        );
    });

    it('ignores html comments containing tags', function () {
        test(
            '<li></li>\
            <!--<li>\
            <a href="">Language</a>\
            </li>-->',
            'li'
        );
    });
});