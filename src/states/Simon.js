import Phaser from 'phaser';
import StartButton from '../sprites/StartButton';
import Question from '../sprites/Question';
import Message from '../sprites/Message';

const ONE_SEC = 1000;
const QUARTER_SEC = ONE_SEC/4;
const SEQUENCE_COUNT = 3;
const BACKGROUND =  "#f2f2f2";

export default class extends Phaser.State {
    init(data) {
        this.data = data;
        this._setupMetrics();
        this.elapsedTime = 0;
        this.simonSequence = [];
        this.playerSequence = [];
        this.simonSequenceIndex = 0;
    }

    create() {
        this.game.stage.backgroundColor = BACKGROUND;
        this.levelDetails = this.game.cache.getJSON('simon');
        this.feedback = this.game.cache.getJSON('feedback');
        let button = new StartButton(this.game, this._startState, this)

        this._addQuestion();
        this._addFeedback();
        this._loadLevel(this.levelDetails.buttons);
        this._setSequence();
        this.game.paused = true;
        this.game.add.existing(button);
    }

    update() {
        if(this.simonSequenceIndex === SEQUENCE_COUNT)
            this.game.time.events.remove(this.playSimonSequence);

        if(this._noMoreAttempts()) {
            this.playerSequence.forEach((button, index) => {
                if(this.simonSequence[index] === button) {
                    this.data.metrics.simon.score += 1;
                }
                else {
                    this._queNextState();
                }
            });
            this._queNextState();
        }
    }

    _queNextState() {
            this.game.state.start('CandyCatch', true, false, this.data)
    }

    _startState(button) {
        this.game.paused = false;
        button.kill();
        this.playSimonSequence = this.game.time.events.loop(ONE_SEC, this._highlightButton, this);
    }

    _setupMetrics() {
        this.data.metrics.simon = this.data.metrics.simon || { score: 0 };
    }

    _addQuestion() {
        let text = 'Pick the grocery items in the same order';
        this.game.add.existing(new Question(this.game, text));
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

    _setSequence() {
        for (var i = 0; i < SEQUENCE_COUNT; i++) {
            let button = this.game.rnd.integerInRange(0,5);
            this.simonSequence.push(button);
        }
        this.data.metrics.simon.simonSequence = this.simonSequence;
    }

    _highlightButton() {
        let button = this.buttons.getAt(this.simonSequence[this.simonSequenceIndex]);
        let selectTween = this.game.add.tween(button).
            to({ alpha: 1 }, QUARTER_SEC, "Linear", false);
        let releaseTween = this.game.add.tween(button).
            to({ alpha: 0.35 }, QUARTER_SEC, "Linear", false);

        selectTween.chain(releaseTween);
        selectTween.start();
        releaseTween.onComplete.add(() => {
            this.simonSequenceIndex++;
        });
    }

    _select(item, pointer) {
        item.alpha = 1;
    }

    _release(item, pointer) {
        item.alpha = .35;
        this._updatePlayerSequence(item);
        this._flashMessage(item);
    }

    _moveOff(item, pointer) {
        item.alpha = .35;
    }

    _updatePlayerSequence(selected) {
        let index = this.buttons.getIndex(selected);
        this.playerSequence.push(index);
    }

    _flashMessage(selected) {
        let index = this.playerSequence.length-1;
        if(this.simonSequence[index] === this.playerSequence[index]) {
            this.rewardMessage.setText(this.feedback.reward[_.random(2)]);
            setTimeout(() => {
                this.rewardMessage.setText('');
            }, 500);
        }
        else {
            this.motivateMessage.setText(this.feedback.motivate[_.random(2)]);
            setTimeout(() => {
                this.motivateMessage.setText('');
            }, 500);
        }
    }

    _noMoreAttempts() {
        return this.playerSequence.length === SEQUENCE_COUNT;
    }
}
