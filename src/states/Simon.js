import Phaser from 'phaser';
import config from '../config'

export default class extends Phaser.State {
    init() {
        this.intro = false;
        this.simonSez = false;
        this.sequenceCount = 3;
        this.sequenceList = [];
        this.litButton = 0;
        this.currentCount = 0;
        this.timeCheck = 0;
        this.N = 1;
        this.userCount = 0;
        this.score = 0;
        this.winner = false;
        this.loser = false;
    }

    preload() {
        this.game.load.json('simon','data/simon/simon.json');
        this.game.load.spritesheet('item', 'assets/images/simon/number-buttons.png', 160, 160);
    }

    create() {
        this.game.add.image(0, 0, 'background');
        this.data = this.game.cache.getJSON('simon');

        this._addInstructions();
        this._loadLevel(this.data.buttons);
        this._setSequence();
        setTimeout(() => {
            this._simonSequence();
            this.intro = false;
        }, 2000);
    }

    update() {
        if(this.simonSez) {
            if(this.game.time.now - this.timeCheck > 700-this.N*40) {
                this.buttons.getAt(this.litButton).alpha = .25;
                game.paused = true;

                setTimeout(() => {
                    if(this.currentCount < this.N) {
                        this.game.paused = false;
                        this._simonSequence();
                    } else {
                        this.simonSez = false;
                        game.paused = false;
                    }
                }, 400 - this.N * 20);
            }
        }
    }

    render() {
        if(!this.intro) {
            if(this.simonSez)
                game.debug.text('Pick the following groceries', 300, 96, 'rgb(255,0,0)');
            else
                game.debug.text('YOUR TURN', 420, 95, 'rgb(0,255,0)');
        } else {
            game.debug.text('GET READY', 420, 95, 'rgb(0,0,255)');
        }

        if(this.winner)
            game.debug.text('YOU WON!', 420, 15, 'rgb(0,0,255)');
        else if (this.loser)
            game.debug.text('YOU LOST!', 360, 62, 'rgb(0,0,255)');
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
        for (var i = 0; i < this.sequenceCount; i++) {
            let button = this.game.rnd.integerInRange(0,5);
            this.sequenceList.push(button);
        }
    }

    _simonSequence() {
        this.simonSez = true;
        this.litButton = this.sequenceList[this.currentCount];
        this.buttons.getAt(this.litButton).alpha = 1;
        this.timeCheck = this.game.time.now;
        this.currentCount++;
    }

    _select(item, pointer) {
        if(!this.simonSez && !this.intro && !this.loser && !this.winner)
            item.alpha = 1;
    }

    _release(item, pointer) {
        if(!this.simonSez && !this.intro && !this.loser && !this.winner) {
            item.alpha = .35;
            this._playerSequence(item);
        }
    }

    _moveOff(item, pointer) {
        if(!this.simonSez && !this.intro && !this.loser && !this.winner)
            item.alpha = .35;
    }

    _playerSequence(selected) {
        let correctButton = this.sequenceList[this.userCount];
        let button = this.buttons.getIndex(selected);
        this.userCount++;

        if(button == correctButton) {
            if(this.userCount == this.N) {
                if(this.N == this.sequenceCount) {
                    this.winner = true;
                } else {
                    this.userCount = 0;
                    this.currentCount = 0;
                    this.N++;
                    this.simonSez = true;
                }
            }
            this.score += 1;
            console.log(`score: ${this.score}`);
        } else {
            this.loser = true;
        }
    }
}




