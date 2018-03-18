import Phaser from 'phaser';
import _ from 'lodash';

const SEQUENCE_COUNT = 3;

export default class extends Phaser.State {
    init(data) {
        this.data = data;
        this._setupMetrics();
        this.simonSequence = data.metrics.simon.simonSequence;
        this.playerSequence = [];
    }

    preload() {
        this.game.load.json('simon','data/simon/simon.json');
        this.game.load.spritesheet('item', 'assets/images/simon/grocery-list.jpg', 160, 160);
    }

    create() {
        this.game.stage.backgroundColor = "#f2f2f2";
        this.levelDetails = this.game.cache.getJSON('simon');

        this._addInstructions();
        this._loadLevel(this.levelDetails.buttons);
    }

    update() {
        if(this._noMoreAttempts()) {
            this.playerSequence.forEach((button, index) => {
                if(this.data.metrics.simon.simonSequence[index] === button) {
                    this.data.metrics.recall.score += 1;
                } else {
                    this.game.state.start('LeaderBoard', true, false, this.data)
                }
            });
            this.game.state.start('LeaderBoard', true, false, this.data);
        }
    }

    _noMoreAttempts() {
        return this.playerSequence.length === SEQUENCE_COUNT;
    }

    _setupMetrics() {
        this.data.metrics.recall = this.data.metrics.recall || { score: 0 };
    }

    _addInstructions() {
        let style = { font: "40px Arial",
                      fill: "#FFCC00",
                      stroke: "#333",
                      strokeThickness: 5,
                      align: "center" };
        let text = 'Do you still remember the grocery items you need?';
        this.game.add.text(25, 25, text, style);
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
    }

    _moveOff(item, pointer) {
        item.alpha = .35;
    }

    _rightSequence() {
        return _.isEqual(this.playerSequence, this.simonSequence);
    }
}
