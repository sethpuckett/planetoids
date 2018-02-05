var NeatUi = (function () {
  var neatUiGame = new Phaser.Game(NEAT_UI_WIDTH, NEAT_UI_HEIGHT, Phaser.AUTO, 'neat-ui', { preload: preload, create: create, update: update });

  var graphics;

  function preload() {

  }

  function create() {
    neatUiGame.stage.backgroundColor = "#fff";

    graphics = neatUiGame.add.graphics(0, 0);

    
  }

  function update() {
    // draw a rectangle
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect(50, 250, 100, 100);
  }

  return {

  };
}());