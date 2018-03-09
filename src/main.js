import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Boot from './states/Boot';
import MainMenu from './states/MainMenu';
import Platform from './states/Platform';
import CandyCatch from './states/CandyCatch';

import config from './config';

class Game extends Phaser.Game {
    constructor () {
        super(config.gameWidth, config.gameHeight, Phaser.CANVAS, 'content', null);

        this.state.add('Boot', Boot, false);
        this.state.add('MainMenu', MainMenu, false);
        this.state.add('CandyCatch', CandyCatch, false);
        
        this.score = 0;

        // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
        if (!window.cordova) {
            this.state.start('Boot');
        }
    }
}

window.game = new Game();

if (window.cordova) {
    var app = {
        initialize: function () {
            document.addEventListener(
                'deviceready',
                this.onDeviceReady.bind(this),
                false
            );
        },

        // deviceready Event Handler
        //
        onDeviceReady: function () {
            this.receivedEvent('deviceready');

            // When the device is ready, start Phaser Boot state.
            window.game.state.start('Boot');
        },

        receivedEvent: function (id) {
            console.log('Received Event: ' + id);
        }
    };

    app.initialize();
}
