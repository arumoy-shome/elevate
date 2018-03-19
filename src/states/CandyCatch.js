import Phaser from 'phaser';
import StartButton from '../sprites/StartButton';
import Question from '../sprites/Question';
import Item from '../sprites/Item';
import config from '../config';
import _ from 'lodash';

const SPAWN_OFFSET = 1000;
const GRAVITY = 50;

export default class extends Phaser.State {
    init(data) {
        this.data = data;
        this._setupMetrics();
        this.spawnItemTimer = 0;
        this.heroVsItemCount = 0;
    }

    create () {
        this.game.add.image(0, 0, 'background');
        this.sfx = this.game.add.audio('sfx-collect');
        this.levelDetails = this.game.cache.getJSON(`catch-${this.data.level}`);

        this._addQuestion();
        this._loadLevel(this.levelDetails);
    }

    update() {
        this.spawnItemTimer += this.game.time.elapsed;

        if(this.spawnItemTimer > SPAWN_OFFSET) {
            this.spawnItemTimer = 0;
            this._spawnItems(this.levelDetails.items);
        }
    }

    _setupMetrics() {
        this.data.metrics.candyCatch = this.data.metrics.candyCatch || {
            finalScore: 0,
            score: [],
            collection: []
        };
    }

    _addQuestion() {
        this.game.add.existing(new Question(this.game, this.levelDetails.question));
    }

    _loadLevel(data) {
        this.items = this.game.add.group();
        this.game.physics.arcade.gravity.y = GRAVITY;
    }

    _spawnItems(items) {
        let x = _.floor(_.random(0, 1, true)*config.width);
        let y = _.random(-30, -50);
        let type = _.random(items.length-1);
        let item = new Item(this.game, x, y, items[type].value, type)

        this.items.add(item);
        item.events.onInputDown.add(this._select, this);
    }

    _select(item, pointer) {
        this.sfx.play();
        item.kill();
        this.data.metrics.candyCatch.collection.push(item.value);
        this.heroVsItemCount++;

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
        return (this.heroVsItemCount === 1 &&
                collection[collection.length-1] === this.levelDetails.rightAnswer);
    }

    _startNextLevel() {
        this.data.level++;
        this.game.state.restart(true, false, this.data);
    }
}
