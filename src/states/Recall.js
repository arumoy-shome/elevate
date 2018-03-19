import Phaser from 'phaser';
import Question from '../sprites/Question';
import Message from '../sprites/Message';
import _ from 'lodash';

const SEQUENCE_COUNT = 3;

export default class extends Phaser.State {
    init(data) {
        this.data = data;
        this._setupMetrics();
        this.simonSequence = data.metrics.simon.simonSequence;
        this.playerSequence = [];
    }

    create() {
        this.game.stage.backgroundColor = "#f2f2f2";
        this.sfx = { right: this.game.add.audio('sfx-right'),
                     wrong: this.game.add.audio('sfx-wrong') }

        this.levelDetails = this.game.cache.getJSON('simon');
        this.feedback = this.game.cache.getJSON('feedback');

        this._addQuestion();
        this._addFeedback();
        this._loadLevel(this.levelDetails.buttons);
    }

    update() {
        if(this._noMoreAttempts()) {
            this.playerSequence.forEach((button, index) => {
                if(this.simonSequence[index] === button) {
                    this.data.metrics.recall.score += 1;
                } else {
                    this._queNextState();
                }
            });
            this._queNextState();
        }
    }

    _queNextState() {
        this.game.state.start('LeaderBoard', true, false, this.data)
    }

    _noMoreAttempts() {
        return this.playerSequence.length === SEQUENCE_COUNT;
    }

    _setupMetrics() {
        this.data.metrics.recall = this.data.metrics.recall || { score: 0 };
    }

    _addQuestion() {
        let text = 'Do you still remember the order?';
        this.game.add.existing(new Question(this.game, 50, text));
    }

    _addFeedback() {
        this.rewardMessage = this.game.add.existing(new Message(this.game, ''));
        this.motivateMessage = this.game.add.existing(new Message(this.game, ''));
    }

    _loadLevel(buttons) {
        this.buttons = this.game.add.group();

        buttons.forEach((button, index) => {
            let sprite = this.buttons.create(button.x, button.y, 'item', index)
            this._handleInput(sprite);
            sprite.alpha = 0.35;
        });
    }

    _handleInput(sprite) {
        sprite.inputEnabled = true;
        sprite.input.start(0, true);
        sprite.events.onInputDown.add(this._select, this);
        sprite.events.onInputUp.add(this._release, this);
        sprite.events.onInputOut.add(this._moveOff, this);
    }

    _select(item, pointer) {
        item.alpha = 1;
    }

    _release(item, pointer) {
        item.alpha = .35;
        this.playerSequence.push(this.buttons.getIndex(item));
        this._playFeedback(item);
    }

    _playFeedback(selected) {
        if(this._scored()) {
            this.rewardMessage.setText(this.feedback.reward[_.random(2)]);
            this.sfx.right.play();
            setTimeout(() => {
                this.rewardMessage.setText('');
            }, 500);
        }
        else {
            this.motivateMessage.setText(this.feedback.motivate[_.random(2)]);
            this.sfx.wrong.play();
            setTimeout(() => {
                this.motivateMessage.setText('');
            }, 500);
        }
    }

    _scored() {
        let index = this.playerSequence.length-1;
        return this.simonSequence[index] === this.playerSequence[index];
    }

    _moveOff(item, pointer) {
        item.alpha = .35;
    }

    _rightSequence() {
        return _.isEqual(this.playerSequence, this.simonSequence);
    }
}
