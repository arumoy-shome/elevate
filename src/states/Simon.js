import Phaser from 'phaser';
import StartButton from '../sprites/StartButton';

const ONE_SEC = 1000;
const QUARTER_SEC = 250;
const SEQUENCE_COUNT = 3;

export default class extends Phaser.State {
    init(data) {
        this.data = data;
        this._setupMetrics();
        this.elapsedTime = 0;
        this.simonSequence = [];
        this.playerSequence = [];
        this.simonSequenceIndex = 0;
    }

    preload() {
        this.game.load.json('simon','data/simon/simon.json');
        this.game.load.spritesheet('item', 'assets/images/simon/grocery-list.jpg', 160, 160);
    }

    create() {
        this.game.stage.backgroundColor = "#f2f2f2";
        this.levelDetails = this.game.cache.getJSON('simon');
        let button = new StartButton(this.game, this._startState, this)

        this._addInstructions();
        this._loadLevel(this.levelDetails.buttons);
        this._setSequence();
        this.game.paused = true;
        this.game.add.existing(button);
    }

    update() {
        this.elapsedTime += this.game.time.elapsed;

        if(this._highlightNextButton()) {
            this.game.time.events.add(ONE_SEC, this._highlightButton, this)
            this.simonSequenceIndex++;
        }

        if(this._noMoreAttempts()) {

            this.playerSequence.forEach((button, index) => {
                if(this.simonSequence[index] === button) {
                    this.data.metrics.simon.score += 1;
                }
                else {
                    this.game.state.start('CandyCatch', true, false, this.data)
                }
            });
            this.game.state.start('CandyCatch', true, false, this.data);
        }
    }

    _startState(button) {
        this.game.paused = false;
        button.kill();
    }

    _setupMetrics() {
        this.data.metrics.simon = this.data.metrics.simon || { score: 0 };
    }

    _addInstructions() {
        let style = { font: "40px Arial",
                      fill: "#FFCC00",
                      stroke: "#333",
                      strokeThickness: 5,
                      align: "center" };
        let text = 'Follow the instructions to select your grocery list.';
        this.game.add.text(50, 25, text, style);
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
        let button = this.buttons.getAt(this.simonSequenceIndex);
        let selectTween = this.game.add.tween(button).
            to({ alpha: 1 }, QUARTER_SEC, "Linear", false);
        let releaseTween = this.game.add.tween(button).
            to({ alpha: 0.35 }, QUARTER_SEC, "Linear", false);

        selectTween.chain(releaseTween);
        selectTween.start();
    }

    _highlightNextButton() {
        return (this.simonSequenceIndex < SEQUENCE_COUNT && this.elapsedTime % ONE_SEC === 0)
    }

    _select(item, pointer) {
        item.alpha = 1;
    }

    _release(item, pointer) {
        item.alpha = .35;
        this._updatePlayerSequence(item);
    }

    _moveOff(item, pointer) {
        item.alpha = .35;
    }

    _updatePlayerSequence(selected) {
        let index = this.buttons.getIndex(selected);
        this.playerSequence.push(index);
    }

    _noMoreAttempts() {
        return this.playerSequence.length === SEQUENCE_COUNT;
    }
}
