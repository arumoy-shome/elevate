import Phaser from 'phaser';
import StartButton from '../sprites/StartButton';
import Question from '../sprites/Question';
import Message from '../sprites/Message';
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
        this.sfx = { right: this.game.add.audio('sfx-right'),
                     wrong: this.game.add.audio('sfx-wrong') }

        this.levelDetails = this.game.cache.getJSON(`catch-${this.data.level}`);
        this.feedback = this.game.cache.getJSON('feedback');

        this._addQuestion();
        this._addFeedback();
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

    _addFeedback() {
        this.rewardMessage = this.game.add.existing(new Message(this.game, ''));
        this.motivateMessage = this.game.add.existing(new Message(this.game, ''));
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
        item.kill();
        this.data.metrics.candyCatch.collection.push(item.value);
        this.heroVsItemCount++;

        this._playFeedback();
        this._queNextState();
    }

    _playFeedback() {
        if(this._scored()) {
            this.data.metrics.candyCatch.score.push(1);
            this.rewardMessage.setText(this.feedback.reward[_.random(2)]);
            this.sfx.right.play();
            setTimeout(() => {
                this.rewardMessage.setText('');
            }, 500);
        } else {
            this.data.metrics.candyCatch.score.push(0);
            this.motivateMessage.setText(this.feedback.motivate[_.random(2)]);
            this.sfx.wrong.play();
            setTimeout(() => {
                this.motivateMessage.setText('');
            }, 500);
        }
    }

    _queNextState() {
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
