import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    preload() {
        this.load.image('background', 'assets/images/platform/background.png')
        console.log(this);
    }
    
    create() {
        this.add.image(0, 0, 'background');
    }
}
