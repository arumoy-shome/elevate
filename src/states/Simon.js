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
        this.N = 0;
    }

    preload() {
        this.game.load.json('simon','data/simon/simon.json');
        this.game.load.spritesheet('item', 'assets/images/simon/number-buttons.png', 160, 160);
    }

    create() {
        this.game.add.image(0, 0, 'background');
        this.data = this.game.cache.getJSON('simon');

        this._loadLevel(this.data.buttons);
        this._playIntro();
        this._setSequence();
        setTimeout(() => {
            this._simonSequence();
            this.intro = false;
        }, 6000);
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

    _loadLevel(buttons) {
        this.buttons = this.game.add.group();

        buttons.forEach((button, index) => {
            let sprite = this.buttons.create(button.x, button.y, 'item', index)
            // this._handleInput(sprite);
            sprite.alpha = 0;
        });
    }

    _handleInput(sprite) {
        sprite.inputEnabled = true;
        sprite.input.start(0, true);
        sprite.events.onInputDown.add(select);
        sprite.events.onInputUp.add(release);
        sprite.events.onInputOut.add(moveOff);
    }

    _playIntro() {
        for (let i = 0; i < 6; i++) {
            let flashing = game.add.tween(this.buttons.getAt(i)).
                to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 4, true);
            let final = game.add.tween(this.buttons.getAt(i)).
                to( { alpha: .25 }, 500, Phaser.Easing.Linear.None, true);

            flashing.chain(final);
            flashing.start();
        }
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
}

// function playerSequence(selected) {

//     correctSquare = this.sequenceList[userCount];
//     userCount++;
//     thisSquare = this.buttons.getIndex(selected);

//     if (thisSquare == correctSquare)
//     {
//         if (userCount == this.N)
//         {
//             if (this.N == this.sequenceCount)
//             {
//                 winner = true;
//                 //setTimeout(function(){restart();}, 3000);
//             }
//             else
//             {
//                 userCount = 0;
//                 this.currentCount = 0;
//                 this.N++;
//                 this.simonSez = true;
//             }
//         }
//         score += 1;
//         scoreText.text = 'Score: ' + score + '/3';
//     }
//     else
//     {
//         loser = true;
//         //setTimeout(function(){restart();}, 3000);
//     }

// }

// function select(item, pointer) {

//     if (!this.simonSez && !this.intro && !loser && !winner)
//     {
//         item.alpha = 1;
//     }

// }

// function release(item, pointer) {

//     if (!this.simonSez && !this.intro && !loser && !winner)
//     {
//         item.alpha = .25;
//         playerSequence(item);
//     }
// }

// function moveOff(item, pointer) {

//     if (!this.simonSez && !this.intro && !loser && !winner)
//     {
//         item.alpha = .25;
//     }

// }

// function render() {

//     game.debug.text('Follow the instructions to select your grocery list.', 10, 32, 'rgb(0,0,255)');

//     if (!this.intro)
//     {
//         if (this.simonSez)
//         {
//             game.debug.text('Pick the following groceries', 300, 96, 'rgb(255,0,0)');
//         }
//         else
//         {
//             game.debug.text('Your Turn', 360, 96, 'rgb(0,255,0)');
//         }
//     }
//     else
//     {
//         game.debug.text('Get Ready', 360, 96, 'rgb(0,0,255)');
//     }

//     if (winner)
//     {
//         game.debug.text('You Win!', 360, 62, 'rgb(0,0,255)');

//         // Save score & transition to next game
//         scoreText.text = 'FINAL Score: ' + score + '/3';

//     }
//     else if (loser)
//     {
//         game.debug.text('You Lose!', 360, 62, 'rgb(0,0,255)');

//         // Save score & transition to next game
//         scoreText.text = 'FINAL Score: ' + score + '/3';
//     }

// }

// var userCount = 0;
// var winner;
// var loser;

// var score = 0;
