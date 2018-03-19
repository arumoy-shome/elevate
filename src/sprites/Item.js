import Phaser from 'phaser';
import _ from 'lodash';
import config from '../config';

export default class extends Phaser.Sprite {
    constructor(game, x, y, value, type) {

        super(game, x, y, 'candy');

        this.value = value;
        this.anchor.set(0.5);
        this.game.physics.enable(this);
        this.animations.add('type', [type], 10, true);
        this.animations.play('type');
        this.inputEnabled = true;
        this.input.start(0, true);
    }
}
