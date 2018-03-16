import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init(data) {
        this.simonSequence = data.simonSequence || [];
    }
}
