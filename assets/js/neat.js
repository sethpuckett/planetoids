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

  function getPool() {
    return pool;
  }

  function kill() {
    dead = true;
  }

  function initializeInput() {
    input = [];
    for (var i = 0; i < NEAT_INPUT_SIZE; i++) {
      var row = new Array(NEAT_INPUT_SIZE);
      row.fill(0);
      input.push(row);
    }
  }

  function updateInput(player, enemies) {
    for (var i = 0; i < NEAT_INPUT_SIZE; i++) {
      for (var j = 0; j < NEAT_INPUT_SIZE; j++) {
        input[i][j] = 0;
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
      input[inputX][inputY] = 1;
    });
  }

  function initializePool() {
    pool = newPool();

    for (var i = 0; i < POPULATION; i++) {
      var basic = basicGenome();
      addToSpecies(basic);
    }

    initializeRun();
  }

  function update() {
    var species = pool.species[pool.currentSpecies];
    var genome = species.genomes[pool.currentGenome];

    // displayGenome();

    evaluateCurrent();

    if (dead) {
      var fitness = planetoids.getScore();
      genome.fitness = fitness;
  
      if (fitness > pool.maxFitness) {
        pool.maxFitness = fitness;
      }

      pool.currentSpecies = 0;
      pool.currentGenome = 0;
      while (fitnessAlreadymeasured()) {
        nextGenome();
      }

      initializeRun();
      dead = false;
    }
          
    pool.currentFrame = pool.currentFrame + 1
  }

  // Private Functions

  function newPool() {
    return {
      species: [],
      generation: 0,
      innovation: OUTPUT_COUNT,
      currentSpecies: 0,
      currentGenome: 0,
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

  function newGene() {
    return {
      into: 0,
      out: 0,
      weight: 0.0,
      enabled: true,
      innovation: 0
    };
  }

  function copyGene(gene) {
    var gene2 = newGene();
    gene2.into = gene.into;
    gene2.out = gene.out;
    gene2.weight = gene.weight;
    gene2.enabled = gene.enabled;
    gene2.innovation = gene.innovation;

    return gene2;
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
      pool.currentGenome = 0;
      pool.currentSpecies++;
      if (pool.currentSpecies >= pool.species.length) {
        newGeneration();
        pool.currentSpecies = 0;
      }
    }
  }

  function newGeneration() {
    cullSpecies(false);
    rankGlobally();
    removeStaleSpecies();
    rankGlobally();

    for (var speciesIndex in pool.species) {
      var species = pool.species[speciesIndex];
      calculateAverageFitness(species);
    }

    removeWeakSpecies();

    var sum = totalAverageFitness();
    var children = [];

    for (var speciesIndex in pool.species) {
      var species = pool.species[speciesIndex];
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

    for (var childIndex in children) {
      var child = children[childIndex];
      addToSpecies(child);
    }

    pool.generation++;
  }

  function cullSpecies(cutToOne) {
    for (var speciesIndex in pool.species) {
      var species = pool.species[speciesIndex];
      species.genomes.sort(function(a, b) {
        return b.fitness - a.fitness;
      });

      var remaining = Math.ceil(species.genomes.length / 2);

      if (cutToOne) {
        reamining = 1;
      }

      species.genomes.splice(remaining);
    }
  }

  function rankGlobally() {
    var global = [];
    for (var speciesIndex in pool.species) {
      var species = pool.species[speciesIndex];
      global = global.concat(species.genomes);
    }
    global.sort(function(a, b) {
      return b.fitness - a.fitness;
    });
    for (var i = 0; i < global.length; i++) {
      global[i].globalRank = i + 1;
    }
  }

  function removeStaleSpecies() {
    var survived = [];

    for (var speciesIndex in pool.species) {
      var species = pool.species[speciesIndex];
      species.genomes.sort(function(a, b) {
        return b.fitness - a.fitness;
      });

      if (species.genomes[0].fitness > species.topFitness) {
        species.topFitness = species.genomes[0].fitness;
        species.staleness = 0;
      } else {
        species.staleness++;
      }

      if (species.staleness < STALE_SPECIES || species.topFitness >= pool.maxFitness) {
        survived.push(species);
      }
    }

    pool.species = survived; 
  }

  // TODO: bad name. actually calculating average rank
  function calculateAverageFitness(species) {
    var total = 0;

    for (var genomeIndex in species.genomes) {
      var genome = species.genomes[genomeIndex];
      total += genome.globalRank;
    }

    species.averageFitness = total / species.genomes.length;
  }

  function removeWeakSpecies() {
    var survived = [];

    var sum = totalAverageFitness();

    for (var speciesIndex in pool.species) {
      var species = pool.species[speciesIndex];
      var breed = Math.floor(species.averageFitness / sum * POPULATION);
      if (breed >= 1) {
        survived.push(species);
      }
    }

    pool.species = survived;
  }

  function totalAverageFitness() {
    var total = 0;
    for (var speciesIndex in pool.species) {
      var species = pool.species[speciesIndex];
      total += species.averageFitness;
    }
    return total;
  }

  function breedChild(species) {
    var child = [];
    if (Math.random() < CROSSOVER_CHANCE) {
      var g1 = species.genomes[getRandomInt(0, species.genomes.length - 1)];
      var g2 = species.genomes[getRandomInt(0, species.genomes.length - 1)];
      child = crossover(g1, g2);
    } else {
      var g = species.genomes[getRandomInt(0, species.genomes.length - 1)];
      child = copyGenome(g);
    }

    mutate(child);

    return child;
  }

  function crossover(genome1, genome2) {
    if (genome2.fitness > genome1.fitness) {
      var temp = genome1;
      genome1 = genome2;
      genome2 = temp;
    } 

    var child = newGenome();
    var innovations2 = [];

    for (var geneIndex in genome2.genes) {
      var gene = genome2.genes[geneIndex];
      innovations2[gene.innovation] = gene;
    }

    for (var geneIndex in genome1.genes) {
      var gene1 = genome1.genes[geneIndex];
      var gene2 = innovations2[gene.innovation];
      if (gene2 != null && getRandomBool() && gene2.enabled) {
        child.genes.push(copyGene(gene2));
      } else {
        child.genes.push(copyGene(gene1));
      }
    }

    child.maxNeuron = Math.max(genome1.maxNeuron, genome2.maxNeuron);

    for (var prop in genome1.mutationRates) {
      if (genome1.mutationRates.hasOwnProperty(prop)) {
          child.mutationRates[prop] = genome1.mutationRates[prop];
      }
    }

    return child;
  }

  function copyGenome(genome) {
    var freshGenome = newGenome();
    for (var i = 0; i < genome.genes.length; i++) {
      freshGenome.genes.push(copyGene(genome.genes[i]));
    }
    freshGenome.maxNeuron = genome.maxNeuron;
    freshGenome.mutationRates.connections = genome.mutationRates.connections;
    freshGenome.mutationRates.link = genome.mutationRates.link;
    freshGenome.mutationRates.bias = genome.mutationRates.bias;
    freshGenome.mutationRates.node = genome.mutationRates.node;
    freshGenome.mutationRates.enable = genome.mutationRates.enable;
    freshGenome.mutationRates.disable = genome.mutationRates.disable;

    return freshGenome;
  }

  function addToSpecies(childGenome) {
    var foundSpecies = false;

    for (var speciesIndex in pool.species) {
      var species = pool.species[speciesIndex];
      if (species.genomes.length > 0 && sameSpecies(childGenome, species.genomes[0])) { // TODO: why only checking first element?
        species.genomes.push(childGenome);
        foundSpecies = true;
        break;
      }
    }

    if (!foundSpecies) {
      var childSpecies = newSpecies();
      childSpecies.genomes.push(childGenome);
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
    for (var prop in genome.mutationRates) {
      if (genome.mutationRates.hasOwnProperty(prop)) {
        if (getRandomBool()) {
          genome.mutationRates[prop] = genome.mutationRates[prop] * .95;
        } else {
          genome.mutationRates[prop] = genome.mutationRates[prop] * 1.05;
        }
      }
    }

    if (Math.random() < genome.mutationRates.connections) {
      pointMutate(genome);
    }

    var p = genome.mutationRates.link;
    while (p > 0) {
      if (Math.random() > p) {
        linkMutate(genome, false);
      }
      p -= 1;
    }

    // TODO: better understanding of bias mutation
    p = genome.mutationRates.bias;
    while (p > 0) {
      if (Math.random() > p) {
        linkMutate(genome, true);
      }
      p -= 1;
    }

    p = genome.mutationRates.node;
    while (p > 0) {
      if (Math.random() > p) {
        nodeMutate(genome);
      }
      p -= 1;
    }

    p = genome.mutationRates.enable;
    while (p > 0) {
      if (Math.random() > p) {
        enableDisableMutate(genome, true);
      }
      p -= 1;
    }

    p = genome.mutationRates.disable;
    while (p > 0) {
      if (Math.random() > p) {
        enableDisableMutate(genome, false);
      }
      p -= 1;
    }
  }

  function sameSpecies(genome1, genome2) {
    var dd = DELTA_DISJOINT * disjoint(genome1.genes, genome2.genes);
    var dw = DELTA_WEIGHTS * weights(genome1.genes, genome2.genes);
    return dd + dw < DELTA_THRESHOLD;
  }

  function pointMutate(genome) {
    var step = genome.mutationRates.step;
    for (var geneIndex in genome.genes) {
      var gene = genome.genes[geneIndex];
      if (Math.random() < PERTURB_CHANCE) {
        gene.weight = gene.weight + (Math.random() * step * 2) - step;
      } else {
        gene.weight = Math.random() * 4 - 2;
      }
    }
  }

  function linkMutate(genome, forceBias) {
    var neuron1 = randomNeuron(genome.genes, false);
    var neuron2 = randomNeuron(genome.genes, true);

    var newLink = newGene();
    if (neuron1 < INPUT_COUNT && neuron2 < INPUT_COUNT) {
      return;
    }

    if (neuron2 < INPUT_COUNT) {
      var temp = neuron1;
      neuron1 = neuron2;
      neuron2 = temp;
    }

    newLink.into = neuron1;
    newLink.out = neuron2;

    // TODO: What is this doing? should it be INPUT_COUNT - 1?
    if (forceBias) {
      newLink.into = INPUT_COUNT;
    }

    if (containsLink(genome.genes, newLink)) {
      return;
    }

    newLink.innovation = newInnovation();
    newLink.weight = Math.random() * 4 - 2;

    genome.genes.push(newLink);
  }

  function nodeMutate(genome) {
    if (genome.genes.length == 0) {
      return;
    }

    genome.maxNeuron++;

    var gene = genome.genes[getRandomInt(0, genome.genes.length - 1)];
    if (!gene.enabled) {
      return;
    }
    gene.enabled = false;

    var gene1 = copyGene(gene);
    gene1.out = genome.maxNeuron;
    gene1.weight = 1.0;
    gene1. innovation = newInnovation();
    gene1.enabled = true;
    genome.genes.push(gene1);

    var gene2 = copyGene(gene);
    gene2.into = genome.maxNeuron;
    gene2.innovation = newInnovation();
    gene2.enabled = true;
    genome.genes.push(gene2);
  }

  function enableDisableMutate(genome, enable) {
    var candidates = [];
    for (var geneIndex in genome.genes) {
      var gene = genome.genes[geneIndex];
      if (gene.enabled != enable) {
        candidates.push(gene);
      }
    }

    if (candidates.length == 0) {
      return;
    }

    var gene = candidates[getRandomInt(0, candidates.length - 1)];
    gene.enabled = !gene.enabled;
  }

  function randomNeuron(genes, nonInput) {
    var neurons = [];
    if (!nonInput) {
      for (var i = 0; i < INPUT_COUNT; i++) {
        neurons[i] = true;
      }
    }

    for (var i = 0; i < OUTPUT_COUNT; i++) {
      neurons[MAX_NODES + i] = true;
    }

    for (var i = 0; i < genes.length; i++) {
      if (!nonInput || genes[i].into > INPUT_COUNT) {
        neurons[genes[i].into] = true;
      }

      if (!nonInput || genes[i].out > INPUT_COUNT) {
        neurons[genes[i].out] = true;
      }
    }

    var count = neurons.filter(x => typeof x !== 'undefined').length;
    var n = getRandomInt(0, count - 1);

    for (var neuronIndex in neurons) {
      if (n == 0) {
        return neuronIndex;
      }
      n--;
    }

    return 0;
  }

  function containsLink(genes, link) {
    for (var geneIndex in genes) {
      var gene = genes[geneIndex];
      if (gene.into == link.into && gene.out == link.out) {
        return true;
      }
    }
    return false;
  }

  function newInnovation() {
    pool.innovation++;
    return pool.innovation;
  }

  function clearJoypad() {
    keystate.left = false;
    keystate.right = true;
    keystate.up = false;
    keystate.down = false;
    keystate.space = true;
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
      return b.out - a.out;
    });
  
    for (var geneIndex in genome.genes) {
      var gene = genome.genes[geneIndex];
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

    for (var geneIndex in genes1) {
      var gene = genes1[geneIndex];
      i1[gene.innovation] = true;
    }

    for (var geneIndex in genes2) {
      var gene = genes2[geneIndex];
      i2[gene.innovation] = true;
    }

    var disjointGenes = 0;

    for (var geneIndex in genes1) {
      var gene = genes1[geneIndex];
      if (i2[gene.innovation] == null) {
        disjointGenes++;
      }
    }

    for (var geneIndex in genes2) {
      var gene = genes2[geneIndex];
      if (i1[gene.innovation] == null) {
        disjointGenes++;
      }
    }

    var maxGeneCount = Math.max(genes1.length, genes2.length);
    if (maxGeneCount < 10) {
      maxGeneCount = 1;
    }

    return disjointGenes / maxGeneCount;
  }

  function weights(genes1, genes2) {
    var i2 = [];

    for (var geneIndex in genes2) {
      var gene = genes2[geneIndex];
      i2[gene.innovation] = gene;
    }

    var sum = 0;
    var coincident = 0;

    for (var geneIndex in genes1) {
      var gene = genes1[geneIndex];
      if (i2[gene.innovation] != null) {
        var gene2 = i2[gene.innovation];
        sum += Math.abs(gene.weight - gene2.weight);
        coincident++;
      }
    }

    if (coincident == 0) {
      coincident = 1;
    }

    return sum / coincident;
  }

  function evaluateNetwork(network) {

    // table.insert(inputs, 1) // TODO: What does this do?

    for (var i = 0; i < NEAT_INPUT_SIZE; i++) {
      for (var j = 0; j < NEAT_INPUT_SIZE; j++) {
        var index = (i * NEAT_INPUT_SIZE) + j;
        network.neurons[index].value = input[j][i];
      }
    }

    for (var neuronIndex in network.neurons) {
      var neuron = network.neurons[neuronIndex];
      var sum = 0;
      for (var i = 0; i < neuron.incoming.length; i++) {
        var incoming = neuron.incoming[i];
        var other = network.neurons[incoming.into];
        sum += incoming.weight * other.value;
      }

      if (neuron.incoming.length > 0) {
        neuron.value = sigmoid(sum);
      }
    }

    keystate.up = isOutputActive(network, OUTPUT.UP);
    keystate.down = isOutputActive(network, OUTPUT.DOWN);
    keystate.left = isOutputActive(network, OUTPUT.LEFT);
    keystate.right = isOutputActive(network, OUTPUT.RIGHT);
  }

  function sigmoid(x) {
    return 2 / (1 + Math.exp(-4.9 * x)) - 1;
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

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  return {
    getKeystate: getKeystate,
    getInput: getInput,
    getPool: getPool,
    initializeInput: initializeInput,
    updateInput: updateInput,
    initializePool: initializePool,
    update: update,
    kill: kill
  };
}(Planetoids));