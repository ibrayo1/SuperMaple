class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        this.load.image('playBtn', 'assets/playbutton.png');
        this.load.atlas('title_screen', 'assets/title_screen.png', 'assets/title_screen.json');
        this.load.image('super_maple_title', 'assets/super_maple_title.png');
        this.load.audio('bgm', 'assets/sounds/titleScreenMusic.mp3');
    }

    create() {
        // add the background image to the game
        var title_screen = this.physics.add.sprite(0, 0, 'title_screen', 'tile_1.png')
        .setOrigin(0,0)
        .setDisplaySize(game.config.width, game.config.height);

        // make the title_screen immovable and disable gravity for it
        title_screen.body.immovable = true;
        title_screen.body.allowGravity = false;

        // animation for title screen
        this.anims.create({
            key: 'title_screen_anim',
            frameRate: 5,
            frames: this.anims.generateFrameNames('title_screen',{
                prefix: 'tile_',
                suffix: '.png',
                start: 1,
                end: 16,
                zeroPad: 0
            }),
            repeat: -1
        });

        title_screen.anims.play('title_screen_anim'); // play title screen animation

        // create and play the title music
        var titleMusic = this.sound.add('bgm');
        titleMusic.play();
        titleMusic.setLoop(true);

        // add the title image
        this.titleImage = this.add.image(game.config.width/2, 250, 'super_maple_title');

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