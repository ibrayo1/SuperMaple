class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        this.load.image('playBtn', 'assets/playbutton.png');
        this.load.image('titlebackground', 'assets/titlebackground.png');
        this.load.audio('bgm', 'assets/sounds/titleScreenMusic.mp3');
    }

    create() {
        // add the background image to the game
        this.background = this.add.image(0, 0, 'titlebackground')
        .setOrigin(0, 0)
        .setDisplaySize(game.config.width, game.config.height);

        // create and play the title music
        var titleMusic = this.sound.add('bgm');
        titleMusic.play();
        titleMusic.setLoop(true);

        // create the play button and set the interactivity
        var playBtn = this.add.image(500, 400, 'playBtn').setDisplaySize(152,65);
        playBtn.setInteractive()
        .on('pointerover', () => playBtn.setTint(0xc8ff70) )
        .on('pointerout', () => playBtn.clearTint() )
        .on('pointerdown', () => {
            titleMusic.stop();
            this.scene.start("playGame");
        });
    }
}