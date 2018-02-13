var Planetoids = (function (controls) {
  
  var diamonds;
  var timer;
  var scoreTimer;
  var titleText;
  var scoreText;
  var endScoreText;
  var score;
  var hyperEnabled;

  var game;
  var stateRequest;
  
  function setGame(inputGame) {
    game = inputGame;
  }

  function preload() {
      game.load.image('star', 'assets/image/star.png');
      game.load.image('diamond', 'assets/image/diamond.png');
  }
  
  function create() {
      titleText = game.add.text(100, 150, 'Press Spacebar to Start', { fontSize: '64px', fill: '#fff' });
  }
  
  function inGameUpdate(keystate) {
      game.physics.arcade.overlap(player, diamonds, endGame);
  
      player.body.velocity.x = 0;
      player.body.velocity.y = 0;
  
      var newHyperEnabled = controls.hyperEnabled();

      if (newHyperEnabled != hyperEnabled) {
        timer.stop();
        var loopTime = 500;
        if (newHyperEnabled) {
            loopTime /= HYPER_MULTIPLIER;
        }
        timer.loop(loopTime, createPlanetoid, this);
        timer.start();
      }

      setDiamondVelocity(newHyperEnabled);
      setPlayerVelocity(keystate, newHyperEnabled);
      hyperEnabled = newHyperEnabled;

      var scoreAdd = scoreTimer.elapsed;
      if (newHyperEnabled) {
          scoreAdd *= HYPER_MULTIPLIER;
      }
      score += scoreAdd;
  
      scoreText.text = "Score: " + score;

      //game.debug.body(player);
      //diamonds.forEach(function(diamond) { game.debug.body(diamond); });
  
      diamonds.forEach(wrapDiamond, this);
      wrapPlayer();
  }
  
  function endGameUpdate(keystate) {
      if (keystate.space)
      {
          startGame();
      }
  }

  function getPlayer() {
    return player;
  }

  function getEnemies() {
    return diamonds;
  }

  function requestedState() {
    return stateRequest;
  }

  function clearStateChange() {
      stateRequest = null;
  }

  function startGame() {
    titleText.destroy();
    if (endScoreText != null) {
        endScoreText.destroy();
    }
    scoreText = game.add.text(5, 5, 'Score: 0', { fontSize: '18px', fill: '#fff' });
    score = 0;

    player = game.add.sprite(game.world.width / 2.0, game.world.height / 2.0, 'star');
    player.width = SPRITE_SIZE;
    player.height = SPRITE_SIZE;

    game.physics.arcade.enable(player);
    player.body.setSize(SPRITE_PIXEL_SIZE * .75, SPRITE_PIXEL_SIZE * .75, player.width * .125, player.height * .125);
    diamonds = game.add.group();
    diamonds.enableBody = true;
    
    stateRequest = GAME_STATE.IN_GAME;

    scoreTimer = game.time.create(false);
    scoreTimer.start();

    var loopTime = 500;
    if (controls.hyperEnabled()) {
        loopTime /= HYPER_MULTIPLIER;
    }
    timer = game.time.create(false);
    timer.loop(loopTime, createPlanetoid, this);
    timer.start();

    createPlanetoid();
  }

  function endGame() {
    timer.destroy();
    diamonds.destroy();
    player.kill();
    scoreText.destroy();
    scoreTimer.destroy();

    endScoreText = game.add.text(100, 100, 'Score: ' + score, { fontSize: '48px', fill: '#fff' });    
    titleText = game.add.text(100, 150, 'Press Spacebar to Start', { fontSize: '64px', fill: '#fff' });  

    stateRequest = GAME_STATE.END_GAME;  
  }

  function newGameUpdate(keystate) {
    if (keystate.space)
    {
        startGame();
    }
  }

  function getScore() {
      return score;
  }

  // Private Functions
  
  function createPlanetoid() {
      var rand = game.rnd.integerInRange(0, 3);
      var diamond = game.add.sprite(0, 0, 'diamond');
      diamond.width = SPRITE_SIZE;
      diamond.height = SPRITE_SIZE;
      
      if (rand == 0) {
          diamond.x = 0;
          diamond.y = game.world.height / 2.0;
      } else if (rand == 1) {
          diamond.x = game.world.width;
          diamond.y = game.world.height / 2.0;
      } else if (rand == 2) {
          diamond.x = game.world.width / 2.0;
          diamond.y = game.world.height;
      } else if (rand == 3) {
          diamond.x = game.world.width / 2.0;
          diamond.y = 0;
      }
  
      game.physics.arcade.enable(diamond);
      diamond.body.setSize(SPRITE_PIXEL_SIZE * .75, SPRITE_PIXEL_SIZE * .75, diamond.width * .125, diamond.height * .125);
      var maxVelocity = 200;
      if (controls.hyperEnabled()) {
        maxVelocity *= HYPER_MULTIPLIER;
    }

      diamond.body.velocity.x = game.rnd.integerInRange(-maxVelocity, maxVelocity)
      diamond.body.velocity.y = game.rnd.integerInRange(-maxVelocity, maxVelocity)
      diamonds.add(diamond);
  }

  function setDiamondVelocity(newHyperEnabled) {
    if (newHyperEnabled != hyperEnabled) {
        var changeFactor = 1;
            
        if (newHyperEnabled) {
            changeFactor = HYPER_MULTIPLIER;
        } else {
            changeFactor = 1 / HYPER_MULTIPLIER;
        }

        diamonds.forEach(function(diamond) {
            diamond.body.velocity.x = diamond.body.velocity.x * changeFactor;
            diamond.body.velocity.y = diamond.body.velocity.y * changeFactor;
        });
    }
  }

  function setPlayerVelocity(keystate, newHyperEnabled) {
    var velocity = 150;
    if (newHyperEnabled) {
        velocity *= HYPER_MULTIPLIER;
    }

    if (keystate.left && !keystate.right)
    {
        player.body.velocity.x = -velocity;
    }
    else if (keystate.right && !keystate.left)
    {
        player.body.velocity.x = velocity;
    }

    if (keystate.up && !keystate.down)
    {
        player.body.velocity.y = -velocity;
    }
    else if (keystate.down && !keystate.up)
    {
        player.body.velocity.y = velocity;
    }
  }
  
  function wrapDiamond(diamond) {
      if (diamond.x > game.width) {
          diamond.x -= (SCREEN_SIZE + diamond.width);
      } else if (diamond.x + diamond.width < 0) {
          diamond.x += (SCREEN_SIZE + diamond.width);
      }
  
      if (diamond.y > game.height) {
          diamond.y -= (SCREEN_SIZE + diamond.height);
      } else if (diamond.y + diamond.height < 0) {
          diamond.y += (SCREEN_SIZE + diamond.height);
      }
  }
  
  function wrapPlayer() {
      if (player.x > game.width) {
          player.x = 0 - player.width;
      } else if (player.x + player.width < 0) {
          player.x = game.width;
      }
  
      if (player.y > game.height) {
          player.y = 0 - player.height;
      } else if (player.y + player.height < 0) {
          player.y = game.height;
      }
  }

  return {
    setGame: setGame,
    requestedState: requestedState,
    clearStateChange: clearStateChange,
    preload: preload,
    create: create,
    newGameUpdate: newGameUpdate,
    inGameUpdate: inGameUpdate,
    endGameUpdate: endGameUpdate,
    getPlayer: getPlayer,
    getEnemies: getEnemies,
    getScore: getScore
  };
}(Controls));