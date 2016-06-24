var test = require('./prepare');

describe('script test', function () {
    it('converts script tag', function () {
        test(
            '<script src="http://vjs.zencdn.net/5.10.4/video.js"></script>',
            'script(src="http://vjs.zencdn.net/5.10.4/video.js")'
        );
    });
});