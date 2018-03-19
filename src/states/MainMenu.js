import Phaser from 'phaser';
import { centerGameObject } from '../utils';

export default class extends Phaser.State {
    init(data) {
        this.data = data;
    }

    preload() {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        
        this._loadAssets();
        this._loadData();
    }

    create() {
        this.game.state.start('Simon', true, false, this.data);
    }

    _loadAssets() {
        this.game.load.image('background', 'assets/images/background.png');
        this.game.load.image('ground', 'assets/images/ground.png');
        this.game.load.audio('sfx-right', 'assets/sounds/right.wav');
        this.game.load.audio('sfx-wrong', 'assets/sounds/wrong.wav');
        this.game.load.spritesheet('button-start', 'assets/images/button.png', 401, 143);
        this.game.load.spritesheet('item', 'assets/images/grocery-list.jpg', 160, 160);
        this.game.load.spritesheet('groceries', 'assets/images/groceries.png', 100, 100);
    }
    
    _loadData() {
        this.game.load.json('simon','data/simon.json');
        this.game.load.json('feedback','data/feedback.json');
        this.game.load.json('catch-0','data/catch00.json');
        this.game.load.json('catch-1','data/catch01.json');
        this.game.load.json('catch-2','data/catch02.json');
        this.game.load.json('catch-3','data/catch03.json');
        this.game.load.json('catch-4','data/catch04.json');
    }
}
