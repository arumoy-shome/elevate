import Phaser from 'phaser';

export default class extends Phaser.State {
    init(data) {
        this.simonScore = data.metrics.simon.score;
        this.candyCatchScore = data.metrics.candyCatch.finalScore;
        this.recallScore = data.metrics.recall.score;
    }
    
    create() {
        this.game.add.image(0, 0, 'background');
        let style = { font: "40px Arial",
                              fill: "#FFCC00",
                              stroke: "#333",
                              strokeThickness: 5,
                              align: "center" };
        this.game.add.text(400, 100, `Registration: ${this.simonScore}`, style);
        this.game.add.text(400, 150, `Attention & Calculation: ${this.candyCatchScore}`, style);
        this.game.add.text(400, 200, `Recall: ${this.recallScore}`, style);
        this.game.paused = true;
    }
}
