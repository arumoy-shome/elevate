import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.Button {
    constructor(game, callback, context) {
        super(game,
              game.world.centerX,
              game.world.centerY,
              'button-start',
              callback,
              context);

        this.anchor.setTo(0.5);
    }
}
