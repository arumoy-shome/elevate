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
        this._addQuestion();
        let button = this.game.add.button(this.game.world.centerX,
                                          this.game.world.centerY+200,
                                          'button-restart',
                                          this._restart,
                                          this)
        button.anchor.setTo(0.5);
    }

    _addQuestion() {
        let registrationText = new Question(this.game, this.game.world.centerY-50, `Registration: ${this.simonScore} / 3`)
        let calculationText = new Question(this.game, this.game.world.centerY, `Attention & Calculation: ${this.candyCatchScore} / 5`)
        let recallText = new Question(this.game, this.game.world.centerY+50, `Recall: ${this.recallScore} / 3`)

        this.game.add.existing(registrationText);
        this.game.add.existing(calculationText);
        this.game.add.existing(recallText);
    }

    _restart() {
        let data = {
            level: 0,
            metrics: {}
        };

        this.game.sound.stopAll();
        this.game.state.start('Simon', true, false, data);
    }
}
