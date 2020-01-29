class PlayGame extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    // load up all the require sprites/audio/images/etc. required
    preload(){
        // load up the map and other image we need for the map layer
        this.load.tilemapTiledJSON('map', 'assets/maps/super-mario.json');
        this.load.image('tiles1', 'assets/maps/super-mario.png');
        this.load.image('?-box', 'assets/maps/mysterybox.png');
        this.load.image('brick', 'assets/maps/brick.png');

        // load up the spritesheet for the coin
        this.load.spritesheet('coin', 'assets/coin.png', {frameWidth: 25, frameHeight: 24});

        // load up the atlas for the player sprite
        this.load.atlas('player_sprites', 'assets/player_sprites.png', 'assets/player_sprites.json');

        // load up audio for the bgm of the map and the jump effect audio
        this.load.audio('HenesysBGM', 'assets/sounds/HenesysMusic.mp3');
        this.load.audio('JumpSFX', 'assets/sounds/JumpSFX.mp3');
        this.load.audio('CoinSFX', 'assets/sounds/smb_coin.wav');
    }

    create(){
        // set camera and world bounds
        this.cameras.main.setBounds(0, 0, 10176, 300);
        this.physics.world.setBounds(0, 0, 10176, 720);

        // place map on the canvas
        var map = this.make.tilemap({key: 'map'});
        var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
        var layer = map.createDynamicLayer('World1', tileset, 0, 0);

        // create collusions with the tiles on the map
        layer.setCollisionBetween(14, 16, true);
        layer.setCollisionBetween(21, 22, true);
        layer.setCollisionBetween(27, 28, true);
        layer.setCollision([10, 13, 17, 40]);

        // 14 are "?"" boxes 15 are brick wals 16 are the platform squares
        // 11 and 12 are coins and mushrooms respectively

        // increase the size of the world map by x3
        layer.setScale(3);

        // changes the background color of the canvas
        this.cameras.main.setBackgroundColor(0x6888ff);

        // adds the text, "score", in the upper left hand color
        var score = 0;
        var score_text = this.add.text(20, 20, "SCORE: " + score, {font: "25px Arial", fill: "yellow"});
        score_text.scrollFactorX = 0;

        // creates all the animations for the sprites
        this.create_animations();

        // create the player object
        // set the physics collision with the world
        this.player = this.physics.add.sprite(200, 510, 'player_sprites', 'stand1_0.png');
        this.player.body.setSize(35, 69);
        this.player.body.setCollideWorldBounds(false);
        this.player.flipX = true;

        // add physics collisions with the player
        this.physics.add.collider(this.player, layer);

        layer.forEachTile( tile => {

            // at tile index 14 and 15 switch them out for a sprite tile
            if(tile.index == 14 || tile.index == 15){

                // get the origin of the tile on the map
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                if(layer.getTileAt(tile.x, tile.y-1).index == 11){
                    var coin_tile = layer.getTileAt(tile.x, tile.y-1);

                    const coin_x = coin_tile.getCenterX();
                    const coin_y = coin_tile.getCenterY();

                    // add a coin at that location
                    var coin = this.physics.add.sprite(coin_x, coin_y+55, 'coin').play('coin_anim');
                    coin.body.immovable = true;
                    coin.body.allowGravity = false;

                    // set the display size of the coin
                    coin.displayHeight = 32;
                    coin.displayWidth = 32;

                    // add a tween animation for every bounce block
                    // pause it so that the tween doesnt start right away
                    var cointween = this.tweens.add({
                        targets: coin,
                        y: y - 76,
                        duration: 200,
                        ease: 'Linear',
                        yoyo: true,
                        paused: true
                    });

                    // switch the tile with its respective sprite tile and set it immovable
                    var bounceblock;
                    if(tile.index == 14){
                        bounceblock = this.physics.add.image(x, y, '?-box').setImmovable(true);
                    } else {
                        bounceblock = this.physics.add.image(x, y, 'brick').setImmovable(true);
                    }

                    // make it so that the sprite is not effected by gravity
                    // and enable it to have a physics body and increase the size of it by 3
                    bounceblock.body.allowGravity = false;
                    bounceblock.enableBody = true;
                    bounceblock.setScale(3);

                    // add a tween animation for every bounce block
                    // pause it so that the tween doesnt start right away
                    var tween = this.tweens.add({
                        targets: bounceblock,
                        y: tile.getCenterY() - 8,
                        duration: 200,
                        ease: 'Linear',
                        yoyo: true,
                        paused: true
                    });

                    // add collider callback between player and bounce block with coin tween
                    this.physics.add.collider(this.player, bounceblock, bounceTile, null, this);

                    // callback function which gets activated with bounceblock is collided with
                    function bounceTile(){
                        if(bounceblock.body.touching.down){
                            tween.play();
                            cointween.play();
                            this.sound.play('CoinSFX');
                            score += 100;
                            score_text.setText('SCORE: ' + score);
                        }
                    }

                    layer.removeTileAt(coin_tile.x, coin_tile.y);

                } else{

                    // switch the tile with its respective sprite tile and set it immovable
                    var bounceblock;
                    if(tile.index == 14){
                        bounceblock = this.physics.add.image(x, y, '?-box').setImmovable(true);
                    } else {
                        bounceblock = this.physics.add.image(x, y, 'brick').setImmovable(true);
                    }

                    // make it so that the sprite is not effected by gravity
                    // and enable it to have a physics body and increase the size of it by 3
                    bounceblock.body.allowGravity = false;
                    bounceblock.enableBody = true;
                    bounceblock.setScale(3);

                    // add a tween animation for every bounce block
                    // pause it so that the tween doesnt start right away
                    var tween = this.tweens.add({
                        targets: bounceblock,
                        y: tile.getCenterY() - 8,
                        duration: 200,
                        ease: 'Linear',
                        yoyo: true,
                        paused: true
                    });

                    // add a collider callback between the player and the tile
                    this.physics.add.collider(this.player, bounceblock, bounceTile, null, this);

                    // callback function which enables the bouncing effet on the blocks
                    function bounceTile(){
                        if(bounceblock.body.touching.down)
                            tween.play();
                    }
                }

                // finally remove the static tile from the origin
                layer.removeTileAt(tile.x, tile.y);
            }

        });

        // create and play Henesys background music
        var HenBGMMusic = this.sound.add('HenesysBGM');
        HenBGMMusic.play();
        HenBGMMusic.setLoop(true);
        HenBGMMusic.setVolume(0.3);

        // create the jump sound effect
        this.sound.add('JumpSFX');
        this.sound.add('CoinSFX');

        // this makes the camera follow the player
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.count = 1;
    }

    update(){
        // control the player with left of right keys
        if (this.cursors.left.isDown){
            this.player.setVelocityX(-200);

            this.player.flipX = false; // turns the sprite to face the left

            if(this.player.body.velocity.y == 0){
                this.player.anims.play('player_walk_anim', true);
            }
        } else if (this.cursors.right.isDown){
            this.player.setVelocityX(200);

            this.player.flipX = true; // turns the sprite to face the right

            if (this.player.body.velocity.y == 0){
                this.player.anims.play('player_walk_anim', true);
            }
        } else {
            // if no keys are pressed, the player keeps still
            this.player.setVelocityX(0);
            // Only show the idle animation if the player is footed
            if(this.player.body.velocity.y == 0 && this.player.body.velocity.x == 0){
                this.player.anims.play('player_stand_anim', true);
            }

        }

        // Player can jump while walking any direction by pressing spacebar or 'up' arrow key
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.velocity.y == 0 && this.count == 1){
            this.player.setVelocityY(-650);

            // play player jump sound effect
            this.sound.play('JumpSFX');

            this.count = 2;
            console.log(this.count);
        
        }

        // this ensures that the jump animation plays whenever the vertical velocity is not 0
        if (this.player.body.velocity.y != 0){
            this.player.anims.play('player_jump_anim', true);
        } else {
            this.count = 1;
            console.log(this.count);
        }

        // game over
        if(this.player.y > game.config.height){
            this.scene.restart();
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
    }
}