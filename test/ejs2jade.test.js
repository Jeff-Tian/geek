var test = require('./prepare');

describe('ejs 2 jade', function () {
    it('should convert one line ejs code to jade', function () {
        var ejs = '<div class="test"></div>';
        var jade = 'div(class="test")';

        test(ejs, jade);
    });

    it('should convert multiple line ejs code to jade', function () {
        var ejs =
            '<div class="test">\n<div class="test">test</div></div>';
        var jade = 'div(class="test")\n\tdiv(class="test")\n\t\t| test';

        test(ejs, jade);
    });

    it('should convert more than three lines of ejs code to jade', function () {
        var ejs =
            '<div class="test">\n<div class="test">\n<div class="test">\n</div>\n</div>\n</div>';
        var jade = 'div(class="test")\n\tdiv(class="test")\n\t\tdiv(class="test")';

        test(ejs, jade);
    });

    it('should convert multiple attributes of ejs code to jade', function () {
        var ejs =
            '<div class="test1 test2" style="a: b, c: d;">\n<div class="test">\n<div class="test">\n</div>\n</div>\n</div>';
        var jade = 'div(class="test1 test2", style="a: b, c: d;")\n\tdiv(class="test")\n\t\tdiv(class="test")';

        test(ejs, jade);
    });

    it('should convert inline ejs server render code to jade', function () {
        var ejs =
            '<div class="test"><%= cdn.normal %></div>';
        var jade = 'div(class="test") #{cdn.normal}';

        test(ejs, jade);
    });
});