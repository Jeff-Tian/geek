var test = require('./prepare');

describe('hybrid attributes styles.', function () {
    it('converts hybrid attribute styles', function () {
        test('<ion-content padding class="page1">', 'ion-content(padding="", class="page1")');
    });
});