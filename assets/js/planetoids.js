var Planetoids = (function () {
  
  var diamonds;
  var timer;
  var scoreTimer;
  var titleText;
  var scoreText;
  var endScoreText;
  var score;

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
      titleText = game.add.text(150, 150, 'Press Spacebar to Start', { fontSize: '64px', fill: '#fff' });
  }
  
  function inGameUpdate(keystate) {
      game.physics.arcade.overlap(player, diamonds, endGame);
  
      player.body.velocity.x = 0;
      player.body.velocity.y = 0;
  
      if (keystate.left && !keystate.right)
      {
          player.body.velocity.x = -150;
      }
      else if (keystate.right && !keystate.left)
      {
          player.body.velocity.x = 150;
      }
  
      if (keystate.up && !keystate.down)
      {
          player.body.velocity.y = -150;
      }
      else if (keystate.down && !keystate.up)
      {
          player.body.velocity.y = 150;
      }
  
      score += scoreTimer.elapsed;
  
      scoreText.text = "Score: " + score;
  
      diamonds.forEach(wrapDiamond, this);
      wrapPlayer();
  }
  
  function endGameUpdate(keystate) {
      if (keystate.space)
      {
          startGame();
      }
  }

  function requestedState() {
    return stateRequest;
  }

  function startGame() {
    titleText.destroy();
    if (endScoreText != null) {
        endScoreText.destroy();
    }
    scoreText = game.add.text(5, 5, 'Score: 0', { fontSize: '18px', fill: '#fff' });
    score = 0;

    player = game.add.sprite(game.world.width / 2.0, game.world.height / 2.0, 'star');
    game.physics.arcade.enable(player);
    player.body.setSize(player.width * .75, player.height * .75, player.width * .125, player.height * .125);
    diamonds = game.add.group();
    diamonds.enableBody = true;
    
    stateRequest = GAME_STATE.IN_GAME;

    scoreTimer = game.time.create(false);
    scoreTimer.start();

    timer = game.time.create(false);
    timer.loop(1000, createPlanetoid, this);
    timer.start();
  }

  function endGame() {
    timer.destroy();
    diamonds.destroy();
    player.kill();
    scoreText.destroy();
    scoreTimer.destroy();

    endScoreText = game.add.text(150, 100, 'Score: ' + score, { fontSize: '48px', fill: '#fff' });    
    titleText = game.add.text(150, 150, 'Press Spacebar to Start', { fontSize: '64px', fill: '#fff' });  

    stateRequest = GAME_STATE.END_GAME;  
  }

  function newGameUpdate(keystate) {
    if (keystate.space)
    {
        startGame();
    }
  }
  
  function createPlanetoid() {
      var rand = game.rnd.integerInRange(0, 3);
      var diamond = game.add.sprite(0, 0, 'diamond');
      
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
      diamond.body.setSize(diamond.width * .75, diamond.height * .75, diamond.width * .125, diamond.height * .125);
      
      diamond.body.velocity.x = game.rnd.integerInRange(-200, 200)
      diamond.body.velocity.y = game.rnd.integerInRange(-200, 200)
      diamonds.add(diamond);
  }
  
  function wrapDiamond(diamond) {
      if (diamond.x > game.width) {
          diamond.x = 0 - diamond.width;
      } else if (diamond.x + diamond.width < 0) {
          diamond.x = game.width;
      }
  
      if (diamond.y > game.height) {
          diamond.y = 0 - diamond.height;
      } else if (diamond.y + diamond.height < 0) {
          diamond.y = game.height;
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
    preload: preload,
    create: create,
    newGameUpdate: newGameUpdate,
    inGameUpdate: inGameUpdate,
    endGameUpdate: endGameUpdate
  };
}());