import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init(data) {
        this.simonSequence = data.simonSequence || [];
    }
    
    preload() {
        this.game.load.json('simon','data/simon/simon.json');
        this.game.load.spritesheet('item', 'assets/images/simon/grocery-list.jpg', 160, 160);
    }
}
