import Phaser from 'phaser';
import StartButton from '../sprites/StartButton';

const BTN_WIDTH = 401;
const BTN_HEIGHT = 143;

export default class extends Phaser.State {
    init(data) {
        this.data = data;
    }

    preload() {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        this.game.load.image('background', 'assets/images/platform/background.png');
        this.game.load.spritesheet('button-start',
                                   'assets/images/candy-catch/button-start.png',
                                   401,
                                   143);
    }

    create() {
        this.game.add.image(0, 0, 'background');
        let button = new StartButton(this.game, this._startState, this)
        this.game.add.existing(button);
    }

    _startState() {
        this.game.state.start('Simon', true, false, this.data);
    }
}
