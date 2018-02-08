var Neat = (function (planetoids) {

  var input;
  var pool;
  var dead;

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

  function update() {
    var species = pool.species[pool.currentSpecies];
    var genome = species.genmoes[pool.currentGenome];

    // displayGenome();

    evaluateCurrent();
    getPositions();

    if (dead) {
      var fitness = planetoids.getScore();
      genome.fitness = fitness;
  
      if (fitness > pool.maxFitness) {
        pool.maxFitness = fitness;
      }

      pool.currentSpecies = 1;
      pool.currentGenome = 1;
      while (fitnessAlreadymeasured()) {
        nextGenome();
      }

      initializeRun();
    }
          
    pool.currentFrame = pool.currentFrame + 1
  }

  // Private Functions

  function newPool() {
    return {
      species: [],
      generation: 0,
      innovation: OUTPUTS,
      currentSpecies: 1,
      currentGenome: 1,
      currentFrame: 0,
      maxFitness: 0
    };
  }

  function newGenome() {
    return {
      genes: [],
      fitness: 0,
      adjustedFitness: 0,
      network: [],
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

  function newSpecies() {
    return {
      topFitness: 0,
      staleness: 0,
      genomes: [],
      averageFitness: 0
    };
  }

  function newNeuron() {
    return {
      incoming: [],
      value: 0.0
    };
  }

  function basicGenome() {
    var genome = newGenome();
    genome.maxNeuron = INPUT_COUNT;
    mutate(genome);
    return genome;
  }

  function fitnessAlreadymeasured() {
    var species = pool.species[pool.currentSpecies];
    var genome = species.genomes[pool.currentGenome];
   
    return genome.fitness != 0;
  }

  function nextGenome() {
    pool.currentGenome++;
    if (pool.currentGenome >= pool.species[pool.currentSpecies].genomes.length) {
      pool.currentGenome = 1;
      pool.currentSpecies++;
      if (pool.currentSpecies >= pool.species.length) {
        newGeneration();
        pool.currentSpecies = 1;
      }
    }
  }

  function newGeneration() {
    cullSpecies(false);
    rankGlobally();
    removeStaleSpecies();
    rankGlobally();

    for (var species in pool.species) {
      calculateAverageFitness(species);
    }

    removeWeakSpecies();

    var sum = totalAverageFitness();
    var children = [];

    for (var species in pool.species) {
      var breed = Math.floor(species.averageFitness / sum * POPULATION) - 1;
      for (var i = 0; i < breed; i++) {
        children.push(breedChild(species));
      }
    }

    cullSpecies(true);

    while (children.length + pool.species.length < POPULATION) {
      var species = pool.species[getRandomInt(0, pool.species.length)];
      children.push(breedChild(species));
    }

    for (var child in children) {
      addToSpecies(child);
    }

    pool.generation++;
  }

  function cullSpecies(cutToOne) {

  }

  function rankGlobally() {

  }

  function removeStaleSpecies() {

  }

  function rankGlobally() {

  }

  function calculateAverageFitness(species) {

  }

  function removeWeakSpecies() {

  }

  function totalAverageFitness() {

  }

  function breedChild(species) {
    
  }

  function addToSpecies(childGenome) {
    var foundSpecies = false;

    for (var species in pool.species) {
      if (sameSpecies(childGenome, species.genome[0])) { // TODO: why only checking first element?
        species.genomes.push(childGenome);
        foundSpecies = true;
        break;
      }
    }

    if (!foundSpecies) {
      var childSpecies = newSpecies();
      childSpecies.genomes.push(child);
      pool.species.push(childSpecies);
    }
  }

  function initializeRun() {
    rightmost = 0;
    pool.currentFrame = 0;
    clearJoypad();
  
    var species = pool.species[pool.currentSpecies];
    var genome = species.genomes[pool.currentGenome];
    generateNetwork(genome);
    evaluateCurrent();
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

  function sameSpecies(genome1, genome2)
    var dd = DELTA_DISJOINT * disjoint(genome1.genes, genome2.genes)
    var dw = DELTA_WEIGHT * weights(genome1.genes, genome2.genes)
    return dd + dw < DELTA_THRESHOLD
  end

  function clearJoypad() {
    keypad.left = false;
    keypad.right = true;
    keypad.up = false;
    keypad.down = false;
    keypad.space = true;
  }

  function generateNetwork(genome) {
    var network = {};
    network.neurons = new Array(MAX_NODES + OUTPUT_COUNT);

    for (var i = 0; i < INPUT_COUNT; i++) {
      network.neurons[i] = newNeuron();
    }

    for (var i = 0; i < OUTPUT_COUNT; i++) {
      network.neurons[MAX_NODES + i] = newNeuron();
    }

    genome.genes.sort(function (a, b) {
      return a.out < b.out;
    });
  
    for (var gene in genome.genes) {
      if (gene.enabled) {
        if (network.neurons[gene.out] == null) {
          network.neurons[gene.out] = newNeuron();
        }
        
        var neuron = network.neurons[gene.out];
        neuron.incoming.push(gene);

        if (network.neurons[gene.into] == null) {
          network.neurons[gene.into] = newNeuron();
        }
      }
    }

    genome.network = network;
  }

  function evaluateCurrent() {
    var species = pool.species[pool.currentSpecies];
    var genome = species.genomes[pool.currentGenome];

    evaluateNetwork(genome.network);

    if (keystate.left && keystate.right) {
      keystate.left = false;
      keystate.right = false;
    }

    if (keystate.up && keystate.down) {
      keystate.up = false;
      keystate.down = false;
    }
  }

  function disjoint(genes1, genes2) {
    var i1 = [];
    var i2 = [];

    for (var gene in genes1) {
      i1[gene.innovation] = true;
    }

    for (var gene in genes2) {
      i2[gene.innovation] = true;
    }

    var disjointGenes = 0;

    for (var gene in genes1) {
      if (i2[gene.innovation] == null) {
        disjointGenes++;
      }
    }

    for (var gene in genes2) {
      if (i1[gene.innovation] == null) {
        disjointGenes++;
      }
    }

    var maxGeneCount = Math.max(genes1.length, genes2.length);
    return disjointGenes / maxGeneCount;
  }

  function weights(genes1, genes2) {
    var i2 = [];

    for (var gene in genes2) {
      i2[gene.innovation] = gene;
    }

    var sum = 0;
    var coincident = 0;

    for (var gene in genes1) {
      if (i2[gene.innovation] != null) {
        var gene2 = i2[gene.innovation];
        sum += Math.abs(gene.weight - gene2.weight);
        coincident++;
      }
    }

    return sum / coincident;
  }

  function evaluateNetwork(network) {

    // table.insert(inputs, 1) // TODO: What does this do?

    for (var i = 0; i < NEAT_INPUT_SIZE; i++) {
      for (var j = 0; j < NEAT_INPUT_SIZE; j++) {
        var index = (i * NEAT_INPUT_SIZE) + j;
        network.neurons[index].value = input[i][j];
      }
    }

    for (var neuron in network.neurons) {
      var sum = 0;
      for (var i = 0; i < neuron.incoming.length; i++) {
        var incoming = neuron.incoming[i];
        var other = network.neurons[incoming.into];
        sum += incoming.weight * other.value;
      }

      if (neuron.incoming > 0) {
        neuron.value = sigmoid(sum);
      }
    }

    keystate.up = isOutputActive(network, OUTPUT.UP);
    keystate.down = isOutputActive(network, OUTPUT.DOWN);
    keystate.left = isOutputActive(network, OUTPUT.LEFT);
    keystate.right = isOutputActive(network, OUTPUT.RIGHT);
  }

  function isOutputActive(network, output) {
    return network.neurons[MAX_NODES + output].value > 0;
  }

  function getRandomBool() {
    return Math.random() >= 0.5;
  }

  function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
  }

  return {
    getKeystate: getKeystate,
    getInput: getInput,
    initializeInput: initializeInput,
    updateInput: updateInput,
    initializePool: initializePool,
    update: update
  };
}(Planetoids));