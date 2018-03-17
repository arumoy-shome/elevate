import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init(data) {
        this.data = data;
    }

    preload() {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        this.game.load.image('background', 'assets/images/platform/background.png');
		this.game.load.spritesheet('button-start', 'assets/images/candy-catch/button-start.png', 401, 143);
    }

    create() {
        this.game.add.image(0, 0, 'background');
        this.game.add.button(config.default.width-401-10,
                        config.default.height-143-10,
                        'button-start',
                        this._startGame,
                        this, 1, 0, 2);
    }
    
    _startGame() {
        this.game.state.start('Simon', true, false, this.data);
    }
}
