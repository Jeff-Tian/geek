var test = require('./prepare');

describe('angular 2 grammer', function () {
    it('converts html to jade', function () {
        test('<ion-navbar *navbar>', 'ion-navbar(\'*navbar\'="")');
    });

    it('handles extra space', function () {
        test('<ion-navbar *navbar >', 'ion-navbar(\'*navbar\'="")');
        test(
            '<ion-navbar *navbar>\
                <ion-title>\
                </ion-title>\
            </ion-navbar>', 'ion-navbar(\'*navbar\'="")\n\tion-title');
    });

    it('handles (click)', function () {
        test('<button (click)="test()"></button>', 'button(\'(click)\'="test()")');
    });

    it('handles [(ngModel)]', function () {
        test('<ion-input type="number" (change)="updateValues()" (focus)="changeSource(\'beginIn\')" [(ngModel)]="model.beginIn" clearInput="" placeholder="期初借入 xxx 元"></ion-input>', 'ion-input(type="number", \'(change)\'="updateValues()", \'(focus)\'="changeSource(\'beginIn\')", \'[(ngModel)]\'="model.beginIn", clearInput="", placeholder="期初借入 xxx 元")');
    });
});