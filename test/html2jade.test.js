var test = require('./prepare');

describe('html to jade', function () {
    it('converts html to jade', function () {
        test('<p>test</p>', 'p\n\t| test');
    });

    it('converts Chinese html to jade', function () {
        test('<p>请稍等片刻，正在努力地计算中……</p>', 'p\n\t| 请稍等片刻，正在努力地计算中……');
    });

    it('converts input tag', function () {
        test('<input type="button" style="float: right;" id="btnClearAll" value="×" title="清除全部"/><div class="clearFloat"></div>', 'input(type="button", style="float: right;", id="btnClearAll", value="×", title="清除全部")\ndiv(class="clearFloat")');
    });
});