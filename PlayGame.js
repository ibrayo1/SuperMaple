class PlayGame extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    // load up all the require sprites/audio/images/etc. required
    preload(){
        this.load.tilemapTiledJSON('map', 'assets/maps/super-mario.json');
        this.load.image('tiles1', 'assets/maps/super-mario.png');

        this.load.spritesheet('coin', 'assets/coin.png', {frameWidth: 25, frameHeight: 24});

        this.load.atlas('player_sprites', 'assets/player_sprites.png', 'assets/player_sprites.json');

        this.load.audio('HenesysBGM', 'assets/sounds/HenesysMusic.mp3');
        this.load.audio('JumpSFX', 'assets/sounds/JumpSFX.mp3');
    }

    create(){
        this.cameras.main.setBounds(0, 0, 10176, 300);
        this.physics.world.setBounds(0, 0, 10176, 720);
        
        var map = this.make.tilemap({key: 'map'});
        var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
        var layer = map.createDynamicLayer('World1', tileset, 0, 0);

        layer.setCollisionBetween(14, 16, true);
        layer.setCollisionBetween(21, 22, true);
        layer.setCollisionBetween(27, 28, true);
        layer.setCollision([10, 13, 17, 40]);

        // 11 and 12 are coins and mushrooms respectively

        layer.setScale(3);

        // changes the background color of the canvas
        this.cameras.main.setBackgroundColor(0xf2f2f2);

        // adds the text, "Playing game...", in the upper left hand color
        var score = 0;
        var score_text = this.add.text(20, 20, "SCORE: " + score, {font: "25px Arial", fill: "yellow"});
        score_text.scrollFactorX = 0;

        // creates all the animations for the sprites
        this.create_animations();

        // create the jump sound effect
        this.sound.add('JumpSFX');

        // create the player object
        // set the physics collision with the world
        this.player = this.physics.add.sprite(200, 510, 'player_sprites', 'stand1_0.png');
        this.player.body.setCollideWorldBounds(true);
        this.player.flipX = true;

        //spawn coin
        layer.forEachTile(tile => {
            if (tile.index === 11){
                // get the location of that coin
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                // add a coin at that location
                var coin = this.physics.add.sprite(x, y, 'coin').play('coin_anim');

                // set the display size to 16*3 since we scaled the world by 3
                coin.displayHeight = 48;
                coin.displayWidth = 48;

                // set physics collisions
                coin.body.setCollideWorldBounds(true);
                this.physics.add.collider(coin, layer);

                // removes the tile at the current place
                layer.removeTileAt(tile.x, tile.y);
            }
        });

        this.physics.add.collider(this.player, layer);

        // create and play Henesys background music
        var HenBGMMusic = this.sound.add('HenesysBGM');
        HenBGMMusic.play();
        HenBGMMusic.setLoop(true);
        HenBGMMusic.setVolume(0.3);

        // this makes the camera follow the player
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    }

    update(){
        // control the player with left of right keys
        if (this.cursors.left.isDown){
            this.player.setVelocityX(-200);

            this.player.flipX = false; // turns the sprite to face the left

            if(this.player.body.onFloor()){
                this.player.anims.play('player_walk_anim', true);
            }
        } else if (this.cursors.right.isDown){
            this.player.setVelocityX(200);

            this.player.flipX = true; // turns the sprite to face the right

            if (this.player.body.onFloor()){
                this.player.anims.play('player_walk_anim', true);
            }
        } else {
            // if no keys are pressed, the player keeps still
            this.player.setVelocityX(0);
            // Only show the idle animation if the player is footed
            if(this.player.body.onFloor()){
                this.player.anims.play('player_stand_anim', true);
            }

        }

        // Player can jump while walking any direction by pressing spacebar or 'up' arrow key
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()){
            this.player.setVelocityY(-650);

            // play player jump sound effect
            this.sound.play('JumpSFX');
        }

        // this ensure that the jump animation play whenever the player is off the ground
        if (!this.player.body.onFloor()){
            this.player.anims.play('player_jump_anim', true);
        }
    }

    create_animations(){

        // create animation for the coins
        this.anims.create({
            key: 'coin_anim',
            frameRate: 5,
            frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 3}),
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
            frameRate: 5,
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
    }
}