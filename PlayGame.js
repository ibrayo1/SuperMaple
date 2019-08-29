class PlayGame extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    // load up all the require sprites/audio/images/etc. required
    preload(){
        this.load.spritesheet('playerwalking', 'assets/playerwalk.png', {frameWidth: 49, frameHeight: 72});
        this.load.spritesheet('playerstanding', 'assets/playerstanding.png', {frameWidth: 49, frameHeight: 72});
        this.load.spritesheet('playerjumping', 'assets/playerjump.png', {frameWidth: 49, frameHeight: 71});
        this.load.spritesheet('maplewarriorefct', 'assets/maplewarrioreffect.png', {frameWidth: 264, frameHeight: 426});
        this.load.audio('HenesysBGM', 'assets/sounds/HenesysMusic.mp3');
        this.load.audio('JumpSFX', 'assets/sounds/JumpSFX.mp3');
    }

    create(){
        // changes the background color of the canvas
        this.cameras.main.setBackgroundColor(0xf2f2f2);

        // adds the text, "Playing game...", in the upper left hand color
        this.add.text(20, 20, "Playing game...", {font: "25px Arial", fill: "yellow"});

        // creates all the animations for the sprites
        this.create_animations();

        // create the jump sound effect
        this.sound.add('JumpSFX');

        // create maple warrior skll sprite
        this.maplewarrior = this.physics.add.sprite(200, 750, 'maplewarriorefct');
        this.maplewarrior.body.setSize(49, 72);
        this.maplewarrior.body.setOffset(107, 300);
        this.maplewarrior.body.setCollideWorldBounds(true);
        this.maplewarrior.flipX = true;
        this.maplewarrior.anims.play('maple_warrior_anim');

        // create the player object
        // set the physics collision with the world
        this.player = this.physics.add.sprite(200, 750, 'playerstanding');
        this.player.body.setCollideWorldBounds(true);
        this.player.flipX = true;

        // create and play Henesys background music
        var HenBGMMusic = this.sound.add('HenesysBGM');
        HenBGMMusic.play();
        HenBGMMusic.setLoop(true);
        HenBGMMusic.setVolume(0.3);

        // this makes the camera follow the player
        //this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update(){
        // control the player with left of right keys
        if (this.cursors.left.isDown){
            this.player.setVelocityX(-150);
            this.maplewarrior.setVelocityX(-150);

            this.player.flipX = false; // turns the sprite to face the left
            this.maplewarrior.flipX = false;

            if(this.player.body.onFloor()){
                this.player.anims.play('player_walk_anim', true);
            }
        } else if (this.cursors.right.isDown){
            this.player.setVelocityX(150);
            this.maplewarrior.setVelocityX(150);

            this.player.flipX = true; // turns the sprite to face the right
            this.maplewarrior.flipX = true;

            if (this.player.body.onFloor()){
                this.player.anims.play('player_walk_anim', true);
            }
        } else {
            // if no keys are pressed, the player keeps still
            this.player.setVelocityX(0);
            this.maplewarrior.setVelocityX(0);
            // Only show the idle animation if the player is footed
            if(this.player.body.onFloor()){
                this.player.anims.play('player_stand_anim', true);
            }

        }

        // Player can jump while walking any direction by pressing spacebar or 'up' arrow key
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()){
            this.player.setVelocityY(-390);
            this.maplewarrior.setVelocityY(-390);

            // play player jump animation and jump sound effect
            this.player.anims.play('player_jump_anim', true);
            this.sound.play('JumpSFX');
        }
    }

    create_animations(){
        // player walk animation
        this.anims.create({
            key: 'player_walk_anim',
            frames: this.anims.generateFrameNumbers('playerwalking', {start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        });

        // player idle/resting/standing animation
        this.anims.create({
            key: 'player_stand_anim',
            frames: this.anims.generateFrameNumbers('playerstanding', {start: 0, end: 3}),
            frameRate: 3,
            repeat: -1
        });

        // player jump animation
        this.anims.create({
            key: 'player_jump_anim',
            frames: this.anims.generateFrameNumbers('playerjumping', {start: 0, end: 1}),
            frameRate: 3,
            repeat: -1 
        });

        // maple warrior skill animation
        this.anims.create({
            key: 'maple_warrior_anim',
            frameRate: 15,
            repeat: -1, //remove this line for not repeating the animation
            frames: this.anims.generateFrameNumbers('maplewarriorefct', { start: 0, end: 22 })
        });
    }
}