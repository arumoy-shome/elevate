import Phaser from 'phaser';
import config from '../config';


export default class extends Phaser.State {
    init(data) {
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT
        });
        this.spawnCandyTimer = 0;
        this.level = (data.level || 0);
    }

    preload() {
        this.game.load.image('background', 'assets/images/platform/background.png');
        this.game.load.image('ground', 'assets/images/platform/ground.png');
        this.game.load.json('catch-0','data/platform/catch00.json');
        this.game.load.json('catch-1','data/platform/catch01.json');
        this.game.load.json('catch-2','data/platform/catch02.json');
        this.game.load.json('catch-3','data/platform/catch03.json');
        this.game.load.json('catch-4','data/platform/catch04.json');
        this.game.load.audio('sfxCandy', 'assets/sounds/platform/coin.wav');
        this.game.load.spritesheet('hero', 'assets/images/platform/hero.png', 36, 42);
        this.game.load.spritesheet('candy', 'assets/images/candy-catch/candy.png', 82, 98);
        this.game.load.image('game-over', 'assets/images/candy-catch/gameover.png');
    }

    create () {
        this.game.add.image(0, 0, 'background');
        this.sfx = { candy: this.game.add.audio('sfxCandy') };
        this.data = this.game.cache.getJSON(`catch-${this.level}`);

        this._addQuestion();
        this._loadLevel(this.data);
    }

    _addQuestion() {
        let style = { font: "40px Arial",
                              fill: "#FFCC00",
                              stroke: "#333",
                              strokeThickness: 5,
                              align: "center" };
        this.game.add.text(120, 20, this.data.question, style);
    }

    update() {
        this._handleInput();
        this._handleCollisions();

        this.spawnCandyTimer += this.time.elapsed;
        if(this.spawnCandyTimer > 1000) {
            this.spawnCandyTimer = 0;
            this._spawnCandies(this.data.candies);
        }
    }

    _loadLevel(data) {
        this._spawnPlatforms(data.platforms);
        this._spawnHero(data.hero);

        this.candies = this.game.add.group();
        this._spawnCandies(data.candies);

        const GRAVITY = 100;
        this.game.physics.arcade.gravity.y = GRAVITY;
    }

    _spawnPlatforms(platforms) {
        this.platforms = this.game.add.group();

        platforms.forEach((platform) => {
            let sprite = this.platforms.create(platform.x, platform.y, platform.image);
            this.game.physics.enable(sprite);
            sprite.body.allowGravity = false;
            sprite.body.immovable = true;
        });
    }

    _spawnHero(hero) {
        this.hero = new Hero(this.game,hero.x, hero.y);
        this.game.add.existing(this.hero);
    }

    _spawnCandies(candies) {
        let dropPos = Math.floor(Math.random()*config.default.width);
        let dropOffset = [-27,-36,-36,-38,-48];
        let candyType = Math.floor(Math.random()*candies.length);
        let candyIndex = candies[candyType].index;
        let candyValue = candies[candyType].value;

        let sprite = this.candies.create(dropPos, dropOffset[candyIndex], 'candy');
        sprite.value = candyValue;
        sprite.anchor.set(0.5, 0.5);
        this.game.physics.enable(sprite);
        sprite.animations.add('type', [candyIndex], 10, true);
        sprite.animations.play('type');
        this._addCandyText(sprite);
    }

    _addCandyText(sprite) {
        let style = { font: "25px Arial",
                              fill: "#FFCC00",
                              stroke: "#333",
                              strokeThickness: 5,
                              align: "center" };
        let text = this.game.add.text(-10, -10, sprite.value, style);
        sprite.addChild(text);
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
        this.game.physics.arcade.overlap(this.hero, this.candies, (hero, candy) => {
            this.sfx.candy.play();
            candy.kill();
            hero.collections.push(candy.value);

            if(hero.collections.pop() === this.data.rightAnswer) {
                if(this.level === 4) {
                    this.game.add.sprite(200, 100, 'game-over');
                    this.game.paused = true;
                } else {
                    this.game.state.restart(true, false, { level: this.level + 1 });
                }
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
        this.animations.add('stop', [0]);
        this.animations.add('run', [1, 2], 8, true);
        this.collections = [];
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
