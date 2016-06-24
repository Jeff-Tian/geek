var test = require('./prepare');

describe('script test', function () {
    it('converts script tag', function () {
        test(
            '<script src="http://vjs.zencdn.net/5.10.4/video.js"></script>',
            'script(src="http://vjs.zencdn.net/5.10.4/video.js")'
        );

        test(
            '<script>\
                (adsbygoogle = window.adsbygoogle || []).push({});\n</script>',
            'script.\n\t(adsbygoogle = window.adsbygoogle || []).push({});\n');

        test('<ins></ins><script>\n(adsbygoogle = window.adsbygoogle || []).push({});\n</script>', 'ins\nscript.\n\t(adsbygoogle = window.adsbygoogle || []).push({});\n');
    });
});