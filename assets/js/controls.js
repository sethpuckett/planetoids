var Controls = (function () {

  function hyperEnabled() {
    return $("#control-hyper").prop("checked");
  }

  function pauseEnabled() {
    return $("#control-paused").prop("checked");
  }

  function neatUiEnabled() {
    return $("#control-neat-ui").prop("checked");
  }

  function neatControlEnabled() {
    return $("#control-neat").prop("checked");
  }

  return {
    hyperEnabled: hyperEnabled,
    pauseEnabled: pauseEnabled,
    neatUiEnabled: neatUiEnabled,
    neatControlEnabled: neatControlEnabled
  };
}());