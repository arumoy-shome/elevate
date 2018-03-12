import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init() {
        this.sequence = [];
    }

    preload() {
        this.game.load.json('simon-0', 'data/simon/simon00.json')
        this.game.load.spritesheet('candy', 'assets/images/candy-catch/candy.png', 82, 98);
    }

    create() {
        this.game.add.image(0, 0, 'background');

        this.data = this.game.cache.getJSON('simon-0');
        this._loadLevel(this.data);
    }

    _loadLevel(data) {
        this._spawnCandies(data.candies);
        this._loadSequence(data.candies);
    }

    _spawnCandies(candies) {
        this.candies = this.game.add.group();

        candies.forEach((candy) => {
            let candyType = Math.floor(Math.random()*candies.length);

            let sprite = this.candies.create(candy.x, candy.y, 'candy');
            sprite.id = candy.id;
            sprite.anchor.set(0.5, 0.5);
            sprite.animations.add('type', [candyType], 10, true);
            sprite.animations.play('type');
        });
    }

    _loadSequence(candies) {
        candies.forEach((candy) => {
            this.sequence.push(candy.id);
        });
        this.sequence = Phaser.ArrayUtils.shuffle(this.sequence);
    }
}
