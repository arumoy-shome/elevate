import Phaser from 'phaser';
import config from '../config'

export default class extends Phaser.State {
    preload() {
        this.game.load.json('simon','data/simon/simon.json');
        this.game.load.spritesheet('item', 'assets/images/simon/number-buttons.png', 160, 160);
    }

    create() {
        this.game.add.image(0, 0, 'background');

        this.data = this.game.cache.getJSON('simon');
    }
}

// var simon;
// var N = 3;
// var userCount = 0;
// var currentCount = 0;
// var sequenceCount = 3;
// var sequenceList = [];
// var simonSez = false;
// var timeCheck;
// var litSquare;
// var winner;
// var loser;
// var intro;

// var score = 0;
// var scoreText;

// function create() {

//     simon = game.add.group();
//     var item;

//     for (var i = 0; i < 3; i++)
//     {
//         // Adds the 3 items in the first row to simon group
//         item = simon.create(150 + 168 * i, 150, 'item', i);
//         // Enable input.
//         item.inputEnabled = true;
//         item.input.start(0, true);
//         item.events.onInputDown.add(select);
//         item.events.onInputUp.add(release);
//         item.events.onInputOut.add(moveOff);
//         simon.getAt(i).alpha = 0;
//     }

//     for (var i = 0; i < 3; i++)
//     {
//         // Adds the 3 items in the second row to simon group
//         item = simon.create(150 + 168 * i, 318, 'item', i + 3);
//         // Enable input.
//         item.inputEnabled = true;
//         item.input.start(0, true);
//         item.events.onInputDown.add(select);
//         item.events.onInputUp.add(release);
//         item.events.onInputOut.add(moveOff);
//         simon.getAt(i + 3).alpha = 0;
//     }

//     scoreText = game.add.text(16, 40, 'Score: 0/3', { fontSize: '32px', fill: '#000' });

//     introTween();
//     setUp();
//     setTimeout(function(){simonSequence(); intro = false;}, 6000);

// }

// // function restart() {

// //     N = 3;
// //     userCount = 0;
// //     currentCount = 0;
// //     sequenceList = [];
// //     winner = false;
// //     loser = false;
// //     introTween();
// //     setUp();
// //     setTimeout(function(){simonSequence(); intro=false;}, 6000);

// // }

// function introTween() {
//     // This will flash the 6 tiles
//     intro = true;

//     for (var i = 0; i < 6; i++)
//     {
//         var flashing = game.add.tween(simon.getAt(i)).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 4, true);
//         var final = game.add.tween(simon.getAt(i)).to( { alpha: .25 }, 500, Phaser.Easing.Linear.None, true);

//         flashing.chain(final);
//         flashing.start();
//     }

// }

// function update() {

//     if (simonSez)
//     {
//         if (game.time.now - timeCheck >700-N*40)
//         {
//             simon.getAt(litSquare).alpha = .25;
//             game.paused = true;

//             setTimeout(function()
//             {
//                 if ( currentCount< N)
//                 {
//                     game.paused = false;
//                     simonSequence();
//                 }
//                 else
//                 {
//                     simonSez = false;
//                     game.paused = false;
//                 }
//             }, 400 - N * 20);
//         }
//     }
// }

// function playerSequence(selected) {

//     correctSquare = sequenceList[userCount];
//     userCount++;
//     thisSquare = simon.getIndex(selected);

//     if (thisSquare == correctSquare)
//     {
//         if (userCount == N)
//         {
//             if (N == sequenceCount)
//             {
//                 winner = true;
//                 //setTimeout(function(){restart();}, 3000);
//             }
//             else
//             {
//                 userCount = 0;
//                 currentCount = 0;
//                 N++;
//                 simonSez = true;
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

// function simonSequence () {

//     simonSez = true;
//     litSquare = sequenceList[currentCount];
//     simon.getAt(litSquare).alpha = 1;
//     timeCheck = game.time.now;
//     currentCount++;

// }

// function setUp() {

//     // This will set a ranmon sequence of 3 numbers (since sequenceCount is set to 3) of numbers betweem 0,5 (since 6 tiles)
//     for (var i = 0; i < sequenceCount; i++)
//     {
//         thisSquare = game.rnd.integerInRange(0,5);
//         sequenceList.push(thisSquare);
//     }

// }

// function select(item, pointer) {

//     if (!simonSez && !intro && !loser && !winner)
//     {
//         item.alpha = 1;
//     }

// }

// function release(item, pointer) {

//     if (!simonSez && !intro && !loser && !winner)
//     {
//         item.alpha = .25;
//         playerSequence(item);
//     }
// }

// function moveOff(item, pointer) {

//     if (!simonSez && !intro && !loser && !winner)
//     {
//         item.alpha = .25;
//     }

// }

// function render() {

//     game.debug.text('Follow the instructions to select your grocery list.', 10, 32, 'rgb(0,0,255)');

//     if (!intro)
//     {
//         if (simonSez)
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
