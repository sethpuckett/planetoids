var Neat = (function () {

  var input;
  var pool;

  var keystate = {
      left: false,
      right: true,
      up: false,
      down: false,
      space: true,
  };

  function getKeystate() {
    return keystate;
  }

  function getInput() {
    return input;
  }

  function initializeInput() {
    input = [];
    for (var i = 0; i < NEAT_INPUT_SIZE; i++) {
      var row = new Array(NEAT_INPUT_SIZE);
      row.fill(false);
      input.push(row);
    }
  }

  function updateInput(player, enemies) {
    for (var i = 0; i < NEAT_INPUT_SIZE; i++) {
      for (var j = 0; j < NEAT_INPUT_SIZE; j++) {
        input[i][j] = false;
      }
    }

    var xOffset = player.x - (SCREEN_SIZE_WITH_BUFFER / 2);
    var yOffset = player.y - (SCREEN_SIZE_WITH_BUFFER / 2);

    enemies.forEach(function(enemy) {
      var adjustedX = enemy.x - xOffset;
      var adjustedY = enemy.y - yOffset;

      if (adjustedX <= 0) {
        adjustedX += SCREEN_SIZE_WITH_BUFFER;
      } else if (adjustedX >= SCREEN_SIZE_WITH_BUFFER) {
        adjustedX -= SCREEN_SIZE_WITH_BUFFER;
      }

      if (adjustedY <= 0) {
        adjustedY += SCREEN_SIZE_WITH_BUFFER;
      } else if (adjustedY >= SCREEN_SIZE_WITH_BUFFER) {
        adjustedY -= SCREEN_SIZE_WITH_BUFFER;
      }

      inputX = Math.min(NEAT_INPUT_SIZE - 1, parseInt((adjustedX / SCREEN_SIZE_WITH_BUFFER) * NEAT_INPUT_SIZE));
      inputY = Math.min(NEAT_INPUT_SIZE - 1, parseInt((adjustedY / SCREEN_SIZE_WITH_BUFFER) * NEAT_INPUT_SIZE));
      input[inputX][inputY] = true;
    });
  }

  function initializePool() {
    pool = newPool()

    for (var i = 0; i < POPULATION; i++) {
      var basic = basicGenome();
      addToSpecies(basic);
    }

    initializeRun();
  }

  // Private Functions

  function basicGenome() {
    var genome = newGenome();
    genome.maxNeuron = INPUT_COUNT;
    mutate(genome);
    return genome;
  }

  function addToSpecies() {

  }

  function initializeRun() {

  }

  function newGenome() {
    return {
      genes: {},
      fitness: 0,
      adjustedFitness: 0,
      network: {},
      maxneuron: 0,
      globalRank: 0,
      mutationRates: {
        connections: MUTATE_CONNECTION_CHANCE,
        link: LINK_MUTATION_CHANCE,
        bias: BIAS_MUTATION_CHANCE,
        node: NODE_MUTATION_CHANCE,
        enable: ENABLE_MUTATION_CHANCE,
        disable: DISABLE_MUTATION_CHANCE,
        step: STEP_SIZE
      }
    };
  }

  function mutate(genome) {
    for (var prop in genome) {
      if (genome.hasOwnProperty(prop)) {
        if (getRandomBool()) {
          genome[prop] = genome[prop] * .95;
        } else {
          genome[prop] = genome[prop] * 1.05263;
        }
      }
    }
  }

  function getRandomBool() {
    return Math.random() >= 0.5;
  }

  return {
    getKeystate: getKeystate,
    getInput: getInput,
    initializeInput: initializeInput,
    updateInput: updateInput
  };
}());