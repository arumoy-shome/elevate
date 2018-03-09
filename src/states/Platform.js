import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    preload() {
        this.load.image('background', 'assets/images/platform/background.png');
        this.load.image('ground', 'assets/images/platform/ground.png');
        this.load.image('grass8x1', 'assets/images/platform/grass_8x1.png');
        this.load.image('grass6x1', 'assets/images/platform/grass_6x1.png');
        this.load.image('grass4x1', 'assets/images/platform/grass_4x1.png');
        this.load.image('grass2x1', 'assets/images/platform/grass_2x1.png');
        this.load.image('grass1x1', 'assets/images/platform/grass_1x1.png');
        this.load.json('level1','data/platform/level01.json');
    }
    
    create() {
        this.add.image(0, 0, 'background');
        this._loadLevel(this.cache.getJSON('level1'));
    }
    
    _loadLevel(data) {
        data.platforms.forEach((platform) => {
            this.add.sprite(platform.x, platform.y, platform.image);
        });
    }
}
