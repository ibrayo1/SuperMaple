let game;

window.onload = function(){
    let config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 720,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y: 1000},
                debug: false
            }
        },
        scene: [TitleScene, PlayGame],
        audio: {
            disableWebAudio: true
        },
        canvas: document.querySelector('canvas')
    }

    game  = new Phaser.Game(config);
}