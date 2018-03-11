import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init() {
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT
        });
        this.spawnCandyTimer = 0;
        this.candyType = [
            { index: 0, value: 93 },
            { index: 1, value: 86 },
            { index: 2, value: 79 },
            { index: 3, value: 72 },
            { index: 4, value: 65 }
        ];
        // this.player = null;
        // this._candyGroup = null;
        // this._fontStyle = null;
        // define Candy variables to reuse them in Candy.item functions
        // this._scoreText = null;
        // this._health = 0;
    }

    preload() {
        this.game.load.image('background', 'assets/images/platform/background.png');
        this.game.load.image('ground', 'assets/images/platform/ground.png');
        this.game.load.json('level-catch','data/platform/level-catch.json');
        this.game.load.audio('sfxCandy', 'assets/sounds/platform/coin.wav');
        this.game.load.spritesheet('hero', 'assets/images/platform/hero.png', 36, 42);
        this.game.load.spritesheet('candy', 'assets/images/candy-catch/candy.png', 82, 98);
        // this.game.load.image('game-over', 'assets/images/candy-catch/gameover.png');
        // this.game.load.image('score-bg', 'assets/images/candy-catch/score-bg.png');
    }

    create () {
        this.game.add.image(0, 0, 'background');
        this.sfx = {
            candy: this.game.add.audio('sfxCandy')
        }
        this._loadLevel(this.game.cache.getJSON('level-catch'));

        // this._fontStyle = { font: "40px Arial",
        //                     fill: "#FFCC00",
        //                     stroke: "#333",
        //                     strokeThickness: 5,
        //                     align: "center" };
        // this._scoreText = this.add.text(120, 20, "0", this._fontStyle);
        // this._health = 10;
    }

    update() {
        this._handleInput();
        this._handleCollisions();

        this.spawnCandyTimer += this.time.elapsed;
        if(this.spawnCandyTimer > 1000) {
            this.spawnCandyTimer = 0;
            this._spawnCandies();
        }

        // if(!this._health) {
        //     this.add.sprite((config.candyCatch.width-594)/2,
        //                     (config.candyCatch.height-271)/2,
        //                     'game-over');
            // this.game.state.restart();
            // this.game.paused = true;
        // }
    }

    _loadLevel(data) {
        this._spawnPlatforms(data);
        this._spawnHero(data);
        this.candies = this.game.add.group();
        this._spawnCandies();

        const GRAVITY = 100;
        this.game.physics.arcade.gravity.y = GRAVITY;
    }

    _spawnPlatforms(data) {
        this.platforms = this.game.add.group();

        data.platforms.forEach((platform) => {
            let sprite = this.platforms.create(platform.x, platform.y, platform.image);
            this.game.physics.enable(sprite);
            sprite.body.allowGravity = false;
            sprite.body.immovable = true;
        });
    }

    _spawnHero(data) {
        this.hero = new Hero(this.game, data.hero.x, data.hero.y);
        this.game.add.existing(this.hero);
    }

    _spawnCandies() {
        let dropPos = Math.floor(Math.random()*config.default.width);
        let dropOffset = [-27,-36,-36,-38,-48];
        let candyType = Math.floor(Math.random()*this.candyType.length);
        let candyIndex = this.candyType[candyType].index;
        let candyValue = this.candyType[candyType].value;
        let sprite = this.candies.create(dropPos, dropOffset[candyIndex], 'candy');

        sprite.value = candyValue;
        sprite.anchor.set(0.5, 0.5);
        this.game.physics.enable(sprite);
        sprite.animations.add('type', [candyIndex], 10, true);
        sprite.animations.play('type');
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

    _handleCollisions() {
        this.game.physics.arcade.collide(this.hero, this.platforms);
        this.game.physics.arcade.overlap(this.hero, this.candies, (hero, candy) =>{
            this.sfx.candy.play();
            candy.kill();
            console.log(candy.value);
        });
    }
}

class Hero extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'hero');
        this.anchor.set(0.5, 0.5);
        this.game.physics.enable(this);
        this.body.collideWorldBounds = true;
        this.animations.add('stop', [0]);
        this.animations.add('run', [1, 2], 8, true);
    }

    move(direction) {
        const SPEED = 200;
        this.body.velocity.x = direction * SPEED;

        if(this.body.velocity.x < 0) {
            this.scale.x = -1;
        } else if(this.body.velocity.x > 0) {
            this.scale.x = 1;
        }
    }

    update() {
        let animation = this._getAnimation();

        if(this.animations.name != animation) {
            this.animations.play(animation);
        }
    }

    _getAnimation() {
        let name = 'stop';

        if(this.body.velocity.x != 0 && this.body.touching.down) {
            name = 'run';
        }

        return name;
    }
}
