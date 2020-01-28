var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
<<<<<<< HEAD:public/js/game.js
=======
    pixelArt: true,
>>>>>>> 02f85a5c9714902b6e7ced0aa75664cdb40a8d06:game.js
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 1000},
<<<<<<< HEAD:public/js/game.js
            debug: true
=======
            debug: false
>>>>>>> 02f85a5c9714902b6e7ced0aa75664cdb40a8d06:game.js
        }
    },
    scene: [TitleScene, PlayGame],
    audio: {
        disableWebAudio: true
    }
}

var game  = new Phaser.Game(config);