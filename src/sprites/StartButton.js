import Phaser from 'phaser';
import config from '../config';

const BTN_WIDTH = 401;
const BTN_HEIGHT = 143;

export default class extends Phaser.Button {
    constructor(game, callback, context) {
        super(game,
              (config.width - BTN_WIDTH)/2,
              (config.height - BTN_HEIGHT)/2,
              'button-start',
              callback,
              context);
    }
}
