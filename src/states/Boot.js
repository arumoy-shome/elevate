import Phaser from 'phaser';
import WebFont from 'webfontloader';
import config from '../config';

export default class extends Phaser.State {
    preload() {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
    }

    render() {
        this.state.start('MainMenu');
    }
}
