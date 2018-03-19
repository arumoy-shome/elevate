import Phaser from 'phaser';

const STYLE = { font: "40px Pusab",
                fill: "#FFCC00",
                stroke: "#333",
                strokeThickness: 5,
                align: "center" };

export default class extends Phaser.Text {
    constructor(game, y, text) {
        super(game, game.world.centerX, y, text, STYLE);

        this.anchor.setTo(0.5);
    }
}
