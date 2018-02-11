// NEAT Constants

POPULATION = 10
DELTA_DISJOINT = 2.0
DELTA_WEIGHTS = 0.4
DELTA_THRESHOLD = 1.0
 
STALE_SPECIES = 15
 
MUTATE_CONNECTION_CHANCE = 0.25
PERTURB_CHANCE = 0.90
CROSSOVER_CHANCE = 0.75
LINK_MUTATION_CHANCE = 2.0
NODE_MUTATION_CHANCE = 0.50
BIAS_MUTATION_CHANCE = 0.40
STEP_SIZE = 0.1
DISABLE_MUTATION_CHANCE = 0.4
ENABLE_MUTATION_CHANCE = 0.2
 
MAX_NODES = 1000000

// Variable

var SCREEN_SIZE = 500;
var NEAT_UI_WIDTH = 500;
var NEAT_UI_HEIGHT = 400;
var NEAT_INPUT_SIZE = 21;
var SPRITE_SIZE = 24;

// Fixed

SCREEN_SIZE_WITH_BUFFER = SCREEN_SIZE + (SPRITE_SIZE * 2)
JUMP_VALUE = SCREEN_SIZE_WITH_BUFFER / NEAT_INPUT_SIZE;
SPRITE_PIXEL_SIZE = 24;
INPUT_COUNT = NEAT_INPUT_SIZE * NEAT_INPUT_SIZE;

var GAME_STATE = {
  NEW_GAME: 0,
  IN_GAME: 1,
  END_GAME:2
};

var OUTPUT_COUNT = 4;
var OUTPUT = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};