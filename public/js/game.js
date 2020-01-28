var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 1000},
            debug: true
        }
    },
    scene: [TitleScene, PlayGame],
    audio: {
        disableWebAudio: true
    }
}

var game  = new Phaser.Game(config);