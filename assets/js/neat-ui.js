var NeatUi = (function () {

  var INPUT_GRID_SIZE = NEAT_UI_WIDTH / 3;
  var INPUT_CELL_SIZE = INPUT_GRID_SIZE / NEAT_INPUT_SIZE;

  var neatUiGame = new Phaser.Game(NEAT_UI_WIDTH, NEAT_UI_HEIGHT, Phaser.AUTO, 'neat-ui', { preload: preload, create: create, update: update });
  var staticGraphics;
  var upText;
  var downText;
  var leftText;
  var rightText;
  var upButton;
  var downButton;
  var leftButton;
  var rightButton;



  function preload() {

  }

  function create() {
    neatUiGame.stage.backgroundColor = "#fff";

    staticGraphics = neatUiGame.add.graphics(0, 0);

    drawInputGrid();
    drawButtonOutputs();
  }

  function update() {
    
  }

  function drawInputGrid() {
    staticGraphics.lineStyle(1, 0x000, 1);

    for (var i = 0; i < NEAT_INPUT_SIZE; i++) {
      for (var j = 0; j < NEAT_INPUT_SIZE; j++) {
        staticGraphics.drawRect(
          INPUT_CELL_SIZE + INPUT_CELL_SIZE * i, 
          INPUT_CELL_SIZE + INPUT_CELL_SIZE * j, 
          INPUT_CELL_SIZE, 
          INPUT_CELL_SIZE
        );
      }
    }
  }

  function drawButtonOutputs() {
    var textX = NEAT_UI_WIDTH - NEAT_UI_WIDTH / 4;
    var buttonX = textX - INPUT_CELL_SIZE * 5;
    var buttonSize = INPUT_CELL_SIZE * 2;
    
    var yBase = INPUT_CELL_SIZE * 2;
    var yMod = (INPUT_GRID_SIZE / 4);
    var buttonYBuffer = 8;
    var textStyle = { font: 'Bold 18pt Arial', fill: '#000' }
    var 


    upText = neatUiGame.add.text(textX, yBase + yMod * 0, 'Up', textStyle);
    DownText = neatUiGame.add.text(textX, yBase + yMod * 1, 'Down', textStyle);
    LeftText = neatUiGame.add.text(textX, yBase + yMod * 2, 'Left', textStyle);
    RightText = neatUiGame.add.text(textX, yBase + yMod * 3, 'Right', textStyle);
    
    staticGraphics.lineStyle(1, 0x000, 1);
    staticGraphics.drawRect(buttonX, buttonYBuffer + yBase + yMod * 0, buttonSize, buttonSize);
    staticGraphics.drawRect(buttonX, buttonYBuffer + yBase + yMod * 1, buttonSize, buttonSize);
    staticGraphics.drawRect(buttonX, buttonYBuffer + yBase + yMod * 2, buttonSize, buttonSize);
    staticGraphics.drawRect(buttonX, buttonYBuffer + yBase + yMod * 3, buttonSize, buttonSize);
  }

  return {

  };
}());