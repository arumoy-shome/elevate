import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init() {
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT
        });
        console.log(this);
    }

    preload() {
        this.load.image('background', 'assets/images/platform/background.png');
        this.load.image('ground', 'assets/images/platform/ground.png');
        this.load.image('grass8x1', 'assets/images/platform/grass_8x1.png');
        this.load.image('grass6x1', 'assets/images/platform/grass_6x1.png');
        this.load.image('grass4x1', 'assets/images/platform/grass_4x1.png');
        this.load.image('grass2x1', 'assets/images/platform/grass_2x1.png');
        this.load.image('grass1x1', 'assets/images/platform/grass_1x1.png');
        this.load.image('hero', 'assets/images/platform/hero_stopped.png');
        this.load.json('level1','data/platform/level01.json');
    }

    create() {
        this.add.image(0, 0, 'background');
        this._loadLevel(this.cache.getJSON('level1'));
    }

    update() {
        this._handleInput();
    }

    _loadLevel(data) {
        data.platforms.forEach((platform) => {
            this.add.sprite(platform.x, platform.y, platform.image);
        });

        this.hero = new Hero(this.game, data.hero.x, data.hero.y);
        this.game.add.existing(this.hero);
    }

    _handleInput() {
        if(this.keys.left.isDown) {
            this.hero.move(-1);
        } else if(this.keys.right.isDown) {
            this.hero.move(1);
        } else {
            this.hero.move(0);
        }
    }
}

class Hero extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'hero');
        this.anchor.set(0.5, 0.5);
        this.game.physics.enable(this);
    }

    move(direction) {
        const SPEED = 200;
        this.body.velocity.x = direction * SPEED;
    }
}
