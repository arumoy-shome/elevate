import Phaser from 'phaser';

const Y = 50;
const STYLE = { font: "15px Pusab",
                fill: "#FFCC00",
                stroke: "#333",
                strokeThickness: 5,
                align: "center" };

export default class extends Phaser.Text {
    constructor(game, text) {
        super(game, game.world.centerX, Y, text.toUpperCase(), STYLE);
        
        this.anchor.setTo(0.5);
    }
}
