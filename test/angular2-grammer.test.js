var test = require('./prepare');

describe('angular 2 grammer', function () {
    it('converts html to jade', function () {
        test('<ion-navbar *navbar>', 'ion-navbar(*navbar="")');
        test('<ion-navbar *navbar >', 'ion-navbar(*navbar="")');
    });
});