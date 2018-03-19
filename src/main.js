import Phaser from 'phaser';

import MainMenu from './states/MainMenu';
import Simon from './states/Simon';
import Catch from './states/Catch';
import Recall from './states/Recall';
import ScoreBoard from './states/ScoreBoard';

import config from './config';

class Game extends Phaser.Game {
    constructor () {
        super(config.width, config.height, Phaser.CANVAS, 'content', null);

        this.state.add('MainMenu', MainMenu, false);
        this.state.add('Simon', Simon, false);
        this.state.add('Catch', Catch, false);
        this.state.add('Recall', Recall, false);
        this.state.add('ScoreBoard', ScoreBoard, false);

        this.data = {
            level: 0,
            metrics: {}
        };

        // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
        if (!window.cordova) {
            this.state.start('MainMenu', true, false, this.data);
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
