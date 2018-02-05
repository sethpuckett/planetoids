var Controls = (function () {

  function hyperEnabled() {
    return $("#control-hyper").prop("checked");
  }

  function pauseEnabled() {
    return $("#control-pause").checked;
  }

  function neatUiEnabled() {
    return $("#control-neat-ui").checked;
  }

  function neatControlEnabled() {
    return $("#control-neat").checked;
  }

  return {
    hyperEnabled: hyperEnabled,
    pauseEnabled: pauseEnabled,
    neatUiEnabled: neatUiEnabled,
    neatControlEnabled: neatControlEnabled
  };
}());