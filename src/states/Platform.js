import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init() {
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT,
            up: Phaser.KeyCode.UP
        });
        this.score = 0;
    }

    preload() {
        this.game.load.image('background', 'assets/images/platform/background.png');
        this.game.load.image('ground', 'assets/images/platform/ground.png');
        this.game.load.image('grass8x1', 'assets/images/platform/grass_8x1.png');
        this.game.load.image('grass6x1', 'assets/images/platform/grass_6x1.png');
        this.game.load.image('grass4x1', 'assets/images/platform/grass_4x1.png');
        this.game.load.image('grass2x1', 'assets/images/platform/grass_2x1.png');
        this.game.load.image('grass1x1', 'assets/images/platform/grass_1x1.png');
        this.game.load.image('hero', 'assets/images/platform/hero_stopped.png');
        this.game.load.image('invisibleWall', 'assets/images/platform/invisible_wall.png');
        this.game.load.audio('sfxJump', 'assets/sounds/platform/jump.wav');
        this.game.load.audio('sfxCoin', 'assets/sounds/platform/coin.wav');
        this.game.load.audio('sfxStomp', 'assets/sounds/platform/stomp.wav');
        this.game.load.spritesheet('coin', 'assets/images/platform/coin_animated.png', 22, 22);
        this.game.load.spritesheet('spider', 'assets/images/platform/spider.png', 42, 32);
        this.game.load.json('level1','data/platform/level01.json');
    }

    create() {
        this.add.image(0, 0, 'background');
        this.sfx = {
            jump: this.game.add.audio('sfxJump'),
            coin: this.game.add.audio('sfxCoin'),
            stomp: this.game.add.audio('sfxStomp')
        };
        this._loadLevel(this.cache.getJSON('level1'));
    }

    update() {
        this._handleCollisions();
        this._handleInput();
    }

    _loadLevel(data) {
        this._spawnPlatforms(data);
        this._spawnCoins(data);
        this._spawnHero(data);
        this._spawnSpiders(data);
        this._spawnInvisibleWalls(data);

        const GRAVITY = 1200;
        this.game.physics.arcade.gravity.y = GRAVITY;
    }

    _spawnPlatforms(data) {
        this.platforms = this.game.add.group();
        this.invisibleWalls = this.game.add.group();
        this.invisibleWalls.visible = false;

        data.platforms.forEach((platform) => {
            let sprite = this.platforms.create(platform.x, platform.y, platform.image);
            this.game.physics.enable(sprite);
            sprite.body.allowGravity = false;
            sprite.body.immovable = true;

            this._spawnInvisibleWalls(platform.x, platform.y, 'left');
            this._spawnInvisibleWalls(platform.x + sprite.width, platform.y, 'right');
        });
    }

    _spawnInvisibleWalls(x, y, side) {
        let sprite = this.invisibleWalls.create(x, y, 'invisibleWall');
        sprite.anchor.set(side === 'left' ? 1 : 0, 1);
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
    }

    _spawnCoins(data) {
        this.coins = this.game.add.group();

        data.coins.forEach((coin) => {
            let sprite = this.coins.create(coin.x, coin.y, 'coin');
            sprite.anchor.set(0.5, 0.5);
            this.game.physics.enable(sprite);
            sprite.body.allowGravity = false;
            sprite.animations.add('rotate', [0, 1, 2, 1], 6, true);
            sprite.animations.play('rotate');
        });
    }

    _spawnHero(data) {
        this.hero = new Hero(this.game, data.hero.x, data.hero.y);
        this.game.add.existing(this.hero);
    }

    _spawnSpiders(data) {
        this.spiders = this.game.add.group();

        data.spiders.forEach((spider) => {
            let sprite = new Spider(this.game, spider.x, spider.y);
            this.spiders.add(sprite);
        });
    }

    _handleInput() {
        if(this.keys.left.isDown) {
            this.hero.move(-1);
        } else if(this.keys.right.isDown) {
            this.hero.move(1);
        } else {
            this.hero.move(0);
        }

        this.keys.up.onDown.add(() => {
            let didJump = this.hero.jump();

            if(didJump) {
                this.sfx.jump.play();
            }
        });
    }

    _handleCollisions() {
        this.game.physics.arcade.collide(this.hero, this.platforms);
        this.game.physics.arcade.collide(this.spiders, this.platforms);
        this.game.physics.arcade.collide(this.spiders, this.invisibleWalls);
        this.game.physics.arcade.overlap(this.hero, this.coins, (hero, coin) => {
            this.sfx.coin.play();
            coin.kill();
            console.log(this.score++);
        });
        this.game.physics.arcade.overlap(this.hero, this.spiders, (hero, spider) => {
            if(hero.body.velocity.y > 0) {
                this.sfx.stomp.play();
                hero.bounce();
                spider.die();
            } else {
                this.sfx.stomp.play();
                this.game.state.restart();
            }
        });
    }
}

class Hero extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'hero');
        this.anchor.set(0.5, 0.5);
        this.game.physics.enable(this);
        this.body.collideWorldBounds = true;
    }

    move(direction) {
        const SPEED = 200;
        this.body.velocity.x = direction * SPEED;
    }

    jump() {
        const JUMP_SPEED = 600;
        let canJump = this.body.touching.down;

        if(canJump) {
            this.body.velocity.y = -JUMP_SPEED;
        }

        return canJump;
    }

    bounce() {
        const BOUNCE_SPEED = 200;
        this.body.velocity.y = -BOUNCE_SPEED;
    }
}

class Spider extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'spider');
        this.SPEED = 100;
        this.anchor.set(0.5, 0.5);
        this.game.physics.enable(this);
        this.body.collideWorldBounds = true;
        this.body.velocity.x = this.SPEED;
        this.animations.add('crawl', [0, 1, 2], 8, true);
        this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
        this.animations.play('crawl');
    }

    update() {
        if(this.body.touching.right || this.body.blocked.right) {
            this.body.velocity.x = -this.SPEED;
        } else if(this.body.touching.left || this.body.blocked.left) {
            this.body.velocity.x = this.SPEED;
        }
    }

    die() {
        this.body.enable = false;
        this.animations.play('die').onComplete.addOnce(() => {
            this.kill();
        });
    }
}
