var Neat = (function () {

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

  return {
    getKeystate: getKeystate
  };
}());