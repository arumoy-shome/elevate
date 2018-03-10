import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init() {
        this.game.scale.setGameSize(config.candyCatch.width, config.candyCatch.height)
        this._player = null;
        this._candyGroup = null;
        this._spawnCandyTimer = 0;
        this._fontStyle = null;
        // define Candy variables to reuse them in Candy.item functions
        this._scoreText = null;
        this._health = 0;
    }
    
    preload() {
        this.load.image('background', 'assets/images/candy-catch/background.png');
        this.load.image('floor', 'assets/images/candy-catch/floor.png');
        this.load.image('title', 'assets/images/candy-catch/title.png');
        this.load.image('game-over', 'assets/images/candy-catch/gameover.png');
        this.load.image('score-bg', 'assets/images/candy-catch/score-bg.png');
        this.load.spritesheet('candy', 'assets/images/candy-catch/candy.png', 82, 98);
        this.load.spritesheet('monster-idle', 'assets/images/candy-catch/monster-idle.png', 103, 131);
    }

    create () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 200;
        
        this.add.sprite(0, 0, 'background');
        this.add.sprite(-30, config.candyCatch.height-160, 'floor');
        this.add.sprite(10, 5, 'score-bg');
        
        this._player = this.add.sprite(5, 760, 'monster-idle');
        this._player.animations.add('idle',
                                    [0,1,2,3,4,5,6,7,8,9,10,11,12],
                                    10,
                                    true);
        this._player.animations.play('idle');
        
        this._fontStyle = { font: "40px Arial",
                            fill: "#FFCC00",
                            stroke: "#333",
                            strokeThickness: 5,
                            align: "center" };
        this._spawnCandyTimer = 0;
        this._scoreText = this.add.text(120, 20, "0", this._fontStyle);
        this._health = 10;
        // create new group for candy
        this._candyGroup = this.add.group();
        // spawn first candy
        this.spawnCandy();
    }

    update() {
        this._spawnCandyTimer += this.time.elapsed;
        if(this._spawnCandyTimer > 1000) {
            this._spawnCandyTimer = 0;
            this.spawnCandy();
        }
        
        this._candyGroup.forEach((candy) => {
            candy.angle += candy.rotateMe;
        });
        
        if(!this._health) {
            this.add.sprite((config.candyCatch.width-594)/2,
                            (config.candyCatch.height-271)/2,
                            'game-over');
            this.game.paused = true;
        }
    }

    spawnCandy() {
        let dropPos = Math.floor(Math.random()*config.candyCatch.width);
        let dropOffset = [-27,-36,-36,-38,-48];
        let candyType = Math.floor(Math.random()*5);
        let candy = this.add.sprite(dropPos, dropOffset[candyType], 'candy');
        
        candy.animations.add('anim', [candyType], 10, true);
        candy.animations.play('anim');
        
        this.physics.enable(candy, Phaser.Physics.ARCADE);
        
        candy.inputEnabled = true;
        candy.events.onInputDown.add(() => {
            candy.kill();
            this.game.score += 1;
            this._scoreText.setText(this.game.score);
        });

        candy.checkWorldBounds = true;
        candy.events.onOutOfBounds.add(() => {
            candy.kill();
            this._health -= 1;
        });

        candy.anchor.setTo(0.5, 0.5);
        candy.rotateMe = (Math.random()*4)-2;
        this._candyGroup.add(candy);
    }
}
