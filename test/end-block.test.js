var test = require('./prepare');

describe('ends block', function () {
    it('ends block', function () {
        test(
            '<ion-navbar *navbar>\
                <ion-title>\
                    <button clear (click)="updateValues()">\
                        <ion-icon name="refresh"></ion-icon>\
                    </button>\
                </ion-title>\
            </ion-navbar>\
            <ion-content></ion-content>',
            'ion-navbar(\'*navbar\'="")\n\tion-title\n\t\tbutton(clear="", \'(click)\'="updateValues()")\n\t\t\tion-icon(name="refresh")\nion-content'
        );
    });
});