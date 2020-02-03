class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        // load all the assets needed for the title sceen
        this.load.image('playBtn', 'assets/playbutton.png');
        this.load.atlas('title_screen', 'assets/title_screen.png', 'assets/title_screen.json');
        this.load.image('super_maple_title', 'assets/super_maple_title.png');
        this.load.audio('bgm', 'assets/sounds/titleScreenMusic.mp3');

        // load up the map and other image we need for the map layer
        this.load.tilemapTiledJSON('map', 'assets/maps/super-mario.json');
        this.load.image('tiles1', 'assets/maps/super-mario.png');
        this.load.image('?-box', 'assets/maps/mysterybox.png');
        this.load.image('brick', 'assets/maps/brick.png');
        this.load.image('emptybox', 'assets/maps/emptyblock.png');

        // load up the spritesheet for the coin
        this.load.spritesheet('coin', 'assets/maps/coin.png', {frameWidth: 25, frameHeight: 24});

        // load up the atlas for the player sprite
        this.load.atlas('player_sprites', 'assets/player_sprites.png', 'assets/player_sprites.json');

        // load up te atlas for the enemy sprites
        this.load.atlas('shroom_sprite', 'assets/enemies/shroom.png', 'assets/enemies/shroom.json');
        this.load.atlas('igloo_turtle', 'assets/enemies/igloo-turtle.png', 'assets/enemies/igloo-turtle.json');

        // load up audio for the bgm of the map and the jump effect audio
        this.load.audio('HenesysBGM', 'assets/sounds/HenesysMusic.mp3');
        this.load.audio('JumpSFX', 'assets/sounds/JumpSFX.mp3');
        this.load.audio('CoinSFX', 'assets/sounds/smb_coin.wav');

    }

    create() {
        // add the background image to the game
        var title_screen = this.physics.add.sprite(0, 0, 'title_screen', 'tile_1.png')
        .setOrigin(0,0)
        .setDisplaySize(game.config.width, game.config.height);

        // make the title_screen immovable and disable gravity for it
        title_screen.body.immovable = true;
        title_screen.body.allowGravity = false;

        // creates all the animations for the sprites
        this.create_animations();

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

    create_animations(){

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

        // create animation for the coins
        this.anims.create({
            key: 'coin_anim',
            frameRate: 5,
            frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 3}),
            repeat: -1
        });

        // create animation for explosion
        this.anims.create({
           key: 'explosion_anim',
           frameRate: 10,
           frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 12}),
           repeat: -1
        });

        // player idle/resting/standing animation
        this.anims.create({
            key: 'player_stand_anim',
            frameRate: 2,
            frames: this.anims.generateFrameNames('player_sprites', {
                prefix: 'stand1_',
                suffix: '.png',
                start: 0,
                end: 3,
                zeroPad: 0
            }),
            repeat: -1
        });

        // player walk animation
        this.anims.create({
            key: 'player_walk_anim',
            frameRate: 6,
            frames: this.anims.generateFrameNames('player_sprites', {
                prefix: 'walk1_',
                suffix: '.png',
                start: 0,
                end: 3,
                zeroPad: 0
            }),
            repeat: -1
        });

        // player jump animation
        this.anims.create({
            key: 'player_jump_anim',
            frameRate: 2,
            frames: this.anims.generateFrameNames('player_sprites', {
                prefix: 'jump_',
                suffix: '.png',
                start: 0,
                end: 1,
                zeroPad: 0
            }),
            repeat: -1
        });

        // shroom enemy idle animation
        this.anims.create({
            key: 'shroom_idle_anim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('shroom_sprite', {
                prefix: 'shroom_',
                suffix: '.png',
                start: 1,
                end: 3,
                zeroPad: 0
            }),
            repeat: -1
        });
  
        // shroom enemy walk animation
        this.anims.create({
            key: 'shroom_walk_anim',
            frameRate: 7,
            frames: this.anims.generateFrameNames('shroom_sprite', {
                prefix: 'shroom_',
                suffix: '.png',
                start: 4,
                end: 7,
                zeroPad: 0
            }),
            repeat: -1
        });

        // shroom enemy hit animation
        this.anims.create({
            key: 'shroom_hit_anim',
            frameRate: 3,
            frames: this.anims.generateFrameNames('shroom_sprite', {
                prefix: 'shroom_',
                suffix: '.png',
                start: 8,
                end: 8,
                zeroPad: 0
            }),
            repeat: -1
        });

        // shroom enemy death animation
        this.anims.create({
            key: 'shroom_death_anim',
            frameRate: 6,
            frames: this.anims.generateFrameNames('shroom_sprite', {
                prefix: 'shroom_',
                suffix: '.png',
                start: 9,
                end: 12,
                zeroPad: 0
            }),
            repeat: -1
        });

        // igloo turtle enemy idle anim
        this.anims.create({
            key: 'igloo_turtle_idle_anim',
            frameRate: 6,
            frames: this.anims.generateFrameNames('igloo_turtle', {
                prefix: 'igloo_turtle_',
                suffix: '.png',
                start: 1,
                end: 1,
                zeroPad: 0
            }),
            repeat: -1
        });

        // igloo turtle enemy walk anim
        this.anims.create({
            key: 'igloo_turtle_walk_anim',
            frameRate: 7,
            frames: this.anims.generateFrameNames('igloo_turtle', {
                prefix: 'igloo_turtle_',
                suffix: '.png',
                start: 2,
                end: 5,
                zeroPad: 0
            }),
            repeat: -1
        });

        // igloo turtle enemy hit anim
        this.anims.create({
            key: 'igloo_turtle_hit_anim',
            frameRate: 6,
            frames: this.anims.generateFrameNames('igloo_turtle', {
                prefix: 'igloo_turtle_',
                suffix: '.png',
                start: 6,
                end: 6,
                zeroPad: 0
            }),
            repeat: -1
        });

        // igloo turtle enemy death anim
        this.anims.create({
            key: 'igloo_turtle_death_anim',
            frameRate: 6,
            frames: this.anims.generateFrameNames('igloo_turtle', {
                prefix: 'igloo_turtle_',
                suffix: '.png',
                start: 7,
                end: 11,
                zeroPad: 0
            }),
            repeat: -1
        });
    }
}