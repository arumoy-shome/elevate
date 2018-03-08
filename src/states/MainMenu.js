import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    preload() {
        this.load.image('background', 'assets/images/candy-catch/background.png');
        this.load.image('monster-cover', 'assets/images/candy-catch/monster-cover.png');
		this.load.spritesheet('button-start', 'assets/images/candy-catch/button-start.png', 401, 143);
    }

    create() {
        this.add.sprite(0, 0, 'background');
        this.add.sprite(-130, config.gameHeight-514, 'monster-cover');
        this.add.sprite((config.gameWidth-395)/2, 60, 'title');

        this.add.button(config.gameWidth-401-10, config.gameHeight-143-10, 'button-start', this.startGame, this, 1, 0, 2);
    }
    
    startGame() {
        this.state.start('CandyCatch');
    }
}
