import Phaser from 'phaser';
import StartButton from '../sprites/StartButton';
import Item from '../sprites/Item';
import config from '../config';
import _ from 'lodash';

const SPAWN_OFFSET = 500;
const GRAVITY = 50;

export default class extends Phaser.State {
    init(data) {
        this.data = data;
        this._setupMetrics();
        this.spawnItemTimer = 0;
        this.heroVsCandyCount = 0;
    }

    preload() {}

    create () {
        this.game.add.image(0, 0, 'background');
        this.sfx = this.game.add.audio('sfx-collect');
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
        this.spawnItemTimer += this.game.time.elapsed;

        if(this.spawnItemTimer > SPAWN_OFFSET) {
            this.spawnItemTimer = 0;
            this._spawnItems(this.levelDetails.candies);
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
        this.candies = this.game.add.group();

        this.game.physics.arcade.gravity.y = GRAVITY;
    }

    _spawnItems(candies) {
        let x = _.floor(_.random(0, 1, true)*config.width);
        let y = _.random(-30, -50);
        let type = _.random(candies.length-1);
        let item = new Item(this.game, x, y, candies[type].value, type)

        this.candies.add(item);
        item.events.onInputDown.add(this._select, this);
    }

    _select(item, pointer) {
        this.sfx.play();
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
