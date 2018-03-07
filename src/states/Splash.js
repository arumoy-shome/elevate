import Phaser from 'phaser';
import { centerGameObjects } from '../utils';

export default class extends Phaser.State {
    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
        centerGameObjects([this.loaderBg, this.loaderBar]);

        this.load.setPreloadSprite(this.loaderBar);

        this.load.image('background', 'assets/images/background.png');
        this.load.image('floor', 'assets/images/floor.png');
        this.load.image('monster-cover', 'assets/images/monster-cover.png');
        this.load.image('title', 'assets/images/title.png');
        this.load.image('game-over', 'assets/images/gameover.png');
        this.load.image('score-bg', 'assets/images/score-bg.png');
        this.load.image('button-pause', 'assets/images/button-pause.png');
        this.load.image('mushroom', 'assets/images/mushroom2.png');

		this.load.spritesheet('candy', 'assets/images/candy.png', 82, 98);
		this.load.spritesheet('monster-idle', 'assets/images/monster-idle.png', 103, 131);
		this.load.spritesheet('button-start', 'assets/images/button-start.png', 401, 143);
    }

  create () {
    this.state.start('MainMenu');
  }
}
