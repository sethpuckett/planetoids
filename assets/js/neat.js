var Neat = (function () {

  var input;

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

  return {
    getKeystate: getKeystate,
    getInput: getInput,
    initializeInput: initializeInput,
    updateInput: updateInput
  };
}());