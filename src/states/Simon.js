import Phaser from 'phaser';
import config from '../config'

const ONE_SEC = 1000;
const HALF_SEC = 500;
const SEQUENCE_COUNT = 3;

export default class extends Phaser.State {
    init(metrics) {
        this._setupMetrics(metrics);
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
        this.data = this.game.cache.getJSON('simon');

        this._addInstructions();
        this._loadLevel(this.data.buttons);
        this._setSequence();
    }

    update() {
        this.elapsedTime += this.game.time.elapsed;

        if(this._highlightNextButton()) {
            this._highlightButton(this.simonSequenceIndex);
            this.simonSequenceIndex++;
        }

        if(this._noMoreAttempts()) {
            this.playerSequence.forEach((button, index) => {
                if(this.simonSequence[index] === button)
                    this.metrics.simon.score += 1;
                else {
                    console.log(this.metrics.simon.score);
                    this.game.paused = true;
                }
            });
        }
    }

    render() {
        this._getReady();
    }

    _setupMetrics(metrics) {
        this.metrics = metrics || {};
        this.metrics.simon = {
            score: 0
        };
    }

    _getReady() {
        if(this.elapsedTime < ONE_SEC)
            this.game.debug.text('GET READY', 420, 95, 'rgb(0,0,255)');
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
    }

    _highlightButton(index) {
        let button = this.buttons.getAt(index);
        let selectTween = this.game.add.tween(button).
            to({ alpha: 1 }, HALF_SEC, "Linear", false);
        let releaseTween = this.game.add.tween(button).
            to({ alpha: 0.35 }, HALF_SEC, "Linear", false);

        selectTween.chain(releaseTween);
        selectTween.start();
    }

    _highlightNextButton() {
        return (this.elapsedTime % ONE_SEC === 0 &&
                this.simonSequenceIndex < SEQUENCE_COUNT)
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




