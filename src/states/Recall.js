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

    create() {
        this.game.stage.backgroundColor = "#f2f2f2";
        this.data = this.game.cache.getJSON('simon');

        this._addInstructions();
        this._loadLevel(this.data.buttons);
    }

    _addInstructions() {
        let style = { font: "40px Arial",
                      fill: "#FFCC00",
                      stroke: "#333",
                      strokeThickness: 5,
                      align: "center" };
        let text = 'Do you still remember the grocery items you need?';
        this.game.add.text(25, 25, text, style);
    }

    _loadLevel(buttons) {
        this.buttons = this.game.add.group();

        buttons.forEach((button, index) => {
            let sprite = this.buttons.create(button.x, button.y, 'item', index)
            // this._handleInput(sprite);
            sprite.alpha = 0.35;
        });
    }
}
