import Phaser from 'phaser';
import Question from '../sprites/Question';

export default class extends Phaser.State {
    init(data) {
        this.simonScore = data.metrics.simon.score;
        this.candyCatchScore = data.metrics.candyCatch.finalScore;
        this.recallScore = data.metrics.recall.score;
    }

    create() {
        this.game.stage.backgroundColor = "#f2f2f2";
        let scores = this.game.add.group();
        let registrationText = new Question(this.game, this.game.world.centerY-50, `Registration: ${this.simonScore} / 3`)
        let calculationText = new Question(this.game, this.game.world.centerY, `Attention & Calculation: ${this.candyCatchScore} / 5`)
        let recallText = new Question(this.game, this.game.world.centerY+50, `Recall: ${this.recallScore} / 3`)

        this.game.add.existing(registrationText);
        this.game.add.existing(calculationText);
        this.game.add.existing(recallText);
        this.game.paused = true;
    }
}
