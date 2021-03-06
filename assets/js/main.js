(function(planetoids, controls, neat, neatUi) {

var game = new Phaser.Game(SCREEN_SIZE, SCREEN_SIZE, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

var keystate;
var manualKeystate = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
};

var neatControl = false;

$(document).on('change', '#control-paused', function() {
    game.paused = controls.pauseEnabled();   
});

$(document).on('change', '#control-neat', function() {
    neatControl = controls.neatControlEnabled();   
});

function preload() {
    planetoids.setGame(game);
    
    planetoids.preload();
}

function create() {
    gameState = GAME_STATE.NEW_GAME;

    game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

    planetoids.create();
    neat.initializeInput();
    neat.initializePool();
}

function update() {
    if (neatControl) {
        keystate = neat.getKeystate();
    } else {
        keystate = setManualKeystate();        
    }

    if (gameState == GAME_STATE.NEW_GAME) {
        planetoids.newGameUpdate(keystate);
    } else if (gameState == GAME_STATE.IN_GAME) {
        neat.updateInput(planetoids.getPlayer(), planetoids.getEnemies());
        neat.update();
        planetoids.inGameUpdate(keystate);
    } else if (gameState == GAME_STATE.END_GAME) {
        neat.update();        
        planetoids.endGameUpdate(keystate);
    }

    var stateChangeRequest = planetoids.requestedState();
    if (stateChangeRequest != null) {
        gameState = stateChangeRequest;
        planetoids.clearStateChange();
        if (gameState == GAME_STATE.END_GAME) {
            neat.kill();
        }
    }
}

function setManualKeystate() {
    manualKeystate.left = game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
    manualKeystate.right = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
    manualKeystate.up = game.input.keyboard.isDown(Phaser.Keyboard.UP)
    manualKeystate.down = game.input.keyboard.isDown(Phaser.Keyboard.DOWN)
    manualKeystate.space = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)

    return manualKeystate;
}

})(Planetoids, Controls, Neat, NeatUi);