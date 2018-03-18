import Phaser from 'phaser';
import StartButton from '../sprites/StartButton';
import config from '../config';
import _ from 'lodash';

const TWO_SEC = 2000;

export default class extends Phaser.State {
    init(data) {
        this.data = data;
        this._setupMetrics();
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT
        });
        this.spawnCandyTimer = 0;
        this.heroVsCandyCount = 0;
        this.elapsedTime = 0;
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
        this.levelDetails = this.game.cache.getJSON(`catch-${this.data.level}`);

        this._addQuestion();
        this._loadLevel(this.levelDetails);
        if(this.data.level === 0) {
            let button = new StartButton(this.game, this._startState, this)
            this.game.paused = true;
            this.game.add.existing(button);
        }
    }

    update() {
        this.elapsedTime += this.game.time.elapsed;
        this.spawnCandyTimer += this.game.time.elapsed;

        if(this.spawnCandyTimer > TWO_SEC) {
            this.spawnCandyTimer = 0;
            this._spawnCandies(this.levelDetails.candies);
        }
    }

    _startState(button) {
        this.game.paused = false;
        button.kill();
    }

    _setupMetrics() {
        this.data.metrics.candyCatch = this.data.metrics.candyCatch || {
            finalScore: 0,
            score: [],
            collection: []
        };
    }

    _addQuestion() {
        let style = { font: "40px Arial",
                              fill: "#FFCC00",
                              stroke: "#333",
                              strokeThickness: 5,
                              align: "center" };
        this.game.add.text(120, 20, this.levelDetails.question, style);
    }

    _loadLevel(data) {
        this._spawnPlatforms(data.platforms);

        this.candies = this.game.add.group();

        const GRAVITY = 50;
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

    _spawnCandies(candies) {
        let dropPos = Math.floor(Math.random()*config.width);
        let dropOffset = [-27,-36,-36,-38,-48];
        let candyType = Math.floor(Math.random()*candies.length);
        let candyIndex = candies[candyType].index;
        let candyValue = candies[candyType].value;

        let sprite = this.candies.create(dropPos, dropOffset[candyIndex], 'candy');
        sprite.value = candyValue;
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.setTo(1.2, 1.2);
        this.game.physics.enable(sprite);
        sprite.animations.add('type', [candyIndex], 10, true);
        sprite.animations.play('type');
        this._addCandyText(sprite);
        this._handleInput(sprite);
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

    _handleInput(sprite) {
        sprite.inputEnabled = true;
        sprite.input.start(0, true);
        sprite.events.onInputDown.add(this._select, this);
    }

    _select(item, pointer) {
        this.sfx.candy.play();
        item.kill();
        this.data.metrics.candyCatch.collection.push(item.value);
        this.heroVsCandyCount++;

        if(this._scored())
            this.data.metrics.candyCatch.score.push(1);
        else
            this.data.metrics.candyCatch.score.push(0);

        if(this.data.level === 4) {
            this.data.metrics.candyCatch.finalScore = _.sum(this.data.metrics.candyCatch.score);
            this.game.state.start('Recall', true, false, this.data)
        } else {
            this._startNextLevel();
        }
    }

    _scored() {
        let collection = this.data.metrics.candyCatch.collection
        return (this.heroVsCandyCount === 1 &&
                collection[collection.length-1] === this.levelDetails.rightAnswer);
    }

    _startNextLevel() {
        this.data.level++;
        this.game.state.restart(true, false, this.data);
    }
}
