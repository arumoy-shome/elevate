import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
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
        this._spawnCandies(data);
        this._loadSequence(data.number);
    }

    _spawnCandies(data) {
        this.candies = this.game.add.group();

        data.positions.forEach((position) => {
            let candyType = Math.floor(Math.random()*data.number);

            let sprite = this.candies.create(position.x, position.y, 'candy');
            sprite.anchor.set(0.5, 0.5);
            sprite.animations.add('type', [candyType], 10, true);
            sprite.animations.play('type');
        });
    }

    _loadSequence(number) {
        for (let i = 0; i < number; i++)
            this.sequence.push(i);
        this.sequence = Phaser.ArrayUtils.shuffle(this.sequence);
        console.log(this.sequence);
    }
}
