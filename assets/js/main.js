(function(planetoids, controls, neat, neatUi) {

var game = new Phaser.Game(SCREEN_SIZE, SCREEN_SIZE, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

var keystate = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
};

function preload() {
    planetoids.setGame(game);
    
    planetoids.preload();
}

function create() {
    gameState = GAME_STATE.NEW_GAME;

    planetoids.create();
}

function update() {
    if (MANUAL_KEYSTATE) {
        setManualKeystate();
    } else {
        keystate = neat.getKeystate();
    }

    if (gameState == GAME_STATE.NEW_GAME) {
        planetoids.newGameUpdate(keystate);
    } else if (gameState == GAME_STATE.IN_GAME) {
        planetoids.inGameUpdate(keystate);
    } else if (gameState == GAME_STATE.END_GAME) {
        planetoids.endGameUpdate(keystate);
    }

    var stateChangeRequest = planetoids.requestedState();
    if (stateChangeRequest != null) {
        gameState = stateChangeRequest;
    }
}

function setManualKeystate() {
    keystate.left = game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
    keystate.right = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
    keystate.up = game.input.keyboard.isDown(Phaser.Keyboard.UP)
    keystate.down = game.input.keyboard.isDown(Phaser.Keyboard.DOWN)
    keystate.space = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
}

})(Planetoids, Controls, Neat, NeatUi);