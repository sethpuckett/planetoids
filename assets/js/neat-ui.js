var NeatUi = (function (neat) {

  var PADDING_SIZE = 10;
  var INPUT_GRID_SIZE = NEAT_UI_WIDTH / 3;
  var INPUT_CELL_SIZE = INPUT_GRID_SIZE / NEAT_INPUT_SIZE;

  var neatUiGame = new Phaser.Game(NEAT_UI_WIDTH, NEAT_UI_HEIGHT, Phaser.AUTO, 'neat-ui', { preload: preload, create: create, update: update });
  var staticGraphics;
  var inputGraphics;
  var connectionGraphics;
  var upText;
  var downText;
  var leftText;
  var rightText;
  var upButton;
  var downButton;
  var leftButton;
  var rightButton;

  var speciesText;
  var genomeText;
  var generationText;
  var innovationText;
  var maxFitnessTest;
  var geneCountText;

  function preload() {

  }

  function create() {
    neatUiGame.stage.backgroundColor = "#fff";

    staticGraphics = neatUiGame.add.graphics(0, 0);
    inputGraphics = neatUiGame.add.graphics(0, 0);
    connectionGraphics = neatUiGame.add.graphics(0, 0);
    
    createStatText();

    drawInputGrid();
    drawButtonOutputs();
    drawStatLabels();
  }

  function createStatText() {
    var xBase = INPUT_CELL_SIZE + 100;
    var yBase = INPUT_GRID_SIZE + PADDING_SIZE * 2;
    var yRow = 15;

    var textStyle = { font: 'Bold 12pt Arial', fill: '#000' }

    speciesText = neatUiGame.add.text(xBase, yBase + yRow * 0, '0', textStyle);
    genomeText = neatUiGame.add.text(xBase, yBase + yRow * 1, '0', textStyle);
    generationText = neatUiGame.add.text(xBase, yBase + yRow * 2, '0', textStyle);
    innovationText = neatUiGame.add.text(xBase, yBase + yRow * 3, '0', textStyle);
    maxFitnessText = neatUiGame.add.text(xBase, yBase + yRow * 4, '0', textStyle);
    geneCountText = neatUiGame.add.text(xBase, yBase + yRow * 5, '0', textStyle);
  }

  function update() {
    input = neat.getInput();
    pool = neat.getPool();

    if (input != null) {
      drawInput(input);
      drawStats(pool);
      drawConnections(pool);
    }
  }

  function drawInput(input) {
    inputGraphics.clear();
    inputGraphics.lineStyle(1, 0x000000, 1);

    drawPlayer();
    drawEnemies(input);
  }

  function drawPlayer() {
    inputGraphics.beginFill(0x70FF0B, 1);
    inputGraphics.drawRect(
      PADDING_SIZE + (INPUT_CELL_SIZE * parseInt(NEAT_INPUT_SIZE / 2)), 
      PADDING_SIZE + (INPUT_CELL_SIZE * parseInt(NEAT_INPUT_SIZE / 2)), 
      INPUT_CELL_SIZE, 
      INPUT_CELL_SIZE
    );
    inputGraphics.endFill();
  }

  function drawEnemies(input) {
    for (var i = 0; i < NEAT_INPUT_SIZE; i++) {
      for (var j = 0; j < NEAT_INPUT_SIZE; j++) {
        if (input[i][j]) {
          inputGraphics.beginFill(0xFF700B, 1);
          inputGraphics.drawRect(
            PADDING_SIZE + INPUT_CELL_SIZE * i, 
            PADDING_SIZE + INPUT_CELL_SIZE * j, 
            INPUT_CELL_SIZE, 
            INPUT_CELL_SIZE
          );
          inputGraphics.endFill();
        }
      }
    }
  }

  function drawInputGrid() {
    staticGraphics.lineStyle(1, 0x000000, 1);

    for (var i = 0; i < NEAT_INPUT_SIZE; i++) {
      for (var j = 0; j < NEAT_INPUT_SIZE; j++) {
        staticGraphics.drawRect(
          PADDING_SIZE + INPUT_CELL_SIZE * i, 
          PADDING_SIZE + INPUT_CELL_SIZE * j, 
          INPUT_CELL_SIZE, 
          INPUT_CELL_SIZE
        );
      }
    }
  }

  function drawButtonOutputs() {
    var textX = NEAT_UI_WIDTH - NEAT_UI_WIDTH / 4;
    var buttonX = textX - INPUT_GRID_SIZE / 4 - 5;
    var buttonSize = INPUT_GRID_SIZE / 4 - 5;
    
    var yBase = PADDING_SIZE * 2;
    var yMod = (INPUT_GRID_SIZE / 4);
    var textStyle = { font: 'Bold 18pt Arial', fill: '#000' }

    upText = neatUiGame.add.text(textX, yBase + yMod * 0, 'Up', textStyle);
    DownText = neatUiGame.add.text(textX, yBase + yMod * 1, 'Down', textStyle);
    LeftText = neatUiGame.add.text(textX, yBase + yMod * 2, 'Left', textStyle);
    RightText = neatUiGame.add.text(textX, yBase + yMod * 3, 'Right', textStyle);
    
    staticGraphics.lineStyle(1, 0x000000, 1);
    staticGraphics.drawRect(buttonX, yBase + yMod * 0, buttonSize, buttonSize);
    staticGraphics.drawRect(buttonX, yBase + yMod * 1, buttonSize, buttonSize);
    staticGraphics.drawRect(buttonX, yBase + yMod * 2, buttonSize, buttonSize);
    staticGraphics.drawRect(buttonX, yBase + yMod * 3, buttonSize, buttonSize);
  }

  function drawStatLabels() {
    var xBase = INPUT_CELL_SIZE;
    var yBase = INPUT_GRID_SIZE + PADDING_SIZE * 2;
    var yRow = 15;

    var textStyle = { font: 'Bold 12pt Arial', fill: '#000' }

    var speciesLabel = neatUiGame.add.text(xBase, yBase + yRow * 0, 'Species:', textStyle);
    var genomeLabel = neatUiGame.add.text(xBase, yBase + yRow * 1, 'Genome:', textStyle);
    var generationLabel = neatUiGame.add.text(xBase, yBase + yRow * 2, 'Generation:', textStyle);
    var innovationLabel = neatUiGame.add.text(xBase, yBase + yRow * 3, 'Innovation:', textStyle);
    var maxFitnessLabel = neatUiGame.add.text(xBase, yBase + yRow * 4, 'Max Fitness:', textStyle);
    var geneCountLabel = neatUiGame.add.text(xBase, yBase + yRow * 5, 'Gene Count:', textStyle);
  }

  function drawStats(pool) {
    speciesText.text = pool.currentSpecies;
    genomeText.text = pool.currentGenome;
    generationText.text = pool.generation;
    innovationText.text = pool.innovation;
    maxFitnessTest = pool.maxFitness;
    geneCountText = pool.species[pool.currentSpecies].genomes[pool.currentGenome].genes.length;
  }

  function drawConnections(pool) {
    connectionGraphics.clear();

    var genome = pool.species[pool.currentSpecies].genomes[pool.currentGenome];

    for (var geneIndex in genome.genes) {
      var gene = genome.genes[geneIndex];

      var alpha = Math.min(1, .5 + Math.abs(gene.weight) );

      if (gene.weight > 0) {
        connectionGraphics.lineStyle(1, 0x22FF22, alpha);
      } else {
        connectionGraphics.lineStyle(2, 0xFF2222, alpha);
      }

      var yInput = Math.floor(gene.into / NEAT_INPUT_SIZE);
      var xInput = gene.into % NEAT_INPUT_SIZE;
      var xDrawFrom = (PADDING_SIZE + INPUT_CELL_SIZE / 2) + INPUT_CELL_SIZE * xInput;
      var yDrawFrom = (PADDING_SIZE + INPUT_CELL_SIZE / 2) + INPUT_CELL_SIZE * yInput;

      var yOutput = gene.out - MAX_NODES;
      var yBase = PADDING_SIZE * 4;
      var yMod = (INPUT_GRID_SIZE / 4);

      var textX = NEAT_UI_WIDTH - NEAT_UI_WIDTH / 4;
      var buttonX = textX - INPUT_GRID_SIZE / 4 - 5;
      var buttonSize = INPUT_GRID_SIZE / 4 - 5;

      var xDrawTo = buttonX + (INPUT_GRID_SIZE / 4 - 5) / 2;
      var yDrawTo = yBase + (yMod * yOutput);

      if (gene.into < INPUT_COUNT && yOutput >= 0) {
        connectionGraphics.moveTo(xDrawFrom,yDrawFrom);
        connectionGraphics.lineTo(xDrawTo, yDrawTo);
      }
    }
  }

  return {

  };
}(Neat));