var Solution = (function () {

  function getGene(i, o, w) {
    return {
      into: i,
      out: MAX_NODES + o,
      weight: w,
      enabled: true,
      innovation: 0
    };
  }

  function get() {
    var genes = [];

    // down
    genes.push(getGene(46, OUTPUT.DOWN, .8));
    genes.push(getGene(47, OUTPUT.DOWN, .8));
    genes.push(getGene(48, OUTPUT.DOWN, 1));
    genes.push(getGene(49, OUTPUT.DOWN, 1));
    genes.push(getGene(50, OUTPUT.DOWN, 1));
    genes.push(getGene(51, OUTPUT.DOWN, .8));
    genes.push(getGene(52, OUTPUT.DOWN, .8));

    genes.push(getGene(36, OUTPUT.DOWN, .5));
    genes.push(getGene(37, OUTPUT.DOWN, .5));
    genes.push(getGene(38, OUTPUT.DOWN, 1));
    genes.push(getGene(39, OUTPUT.DOWN, .5));
    genes.push(getGene(40, OUTPUT.DOWN, .5));

    genes.push(getGene(26, OUTPUT.DOWN, .5));
    genes.push(getGene(27, OUTPUT.DOWN, .5));
    genes.push(getGene(25, OUTPUT.DOWN, .5));

    // up
    genes.push(getGene(68, OUTPUT.UP, .8));
    genes.push(getGene(69, OUTPUT.UP, .8));
    genes.push(getGene(70, OUTPUT.UP, 1));
    genes.push(getGene(71, OUTPUT.UP, 1));
    genes.push(getGene(72, OUTPUT.UP, 1));
    genes.push(getGene(73, OUTPUT.UP, .8));
    genes.push(getGene(74, OUTPUT.UP, .8));

    genes.push(getGene(80, OUTPUT.UP, .5));
    genes.push(getGene(81, OUTPUT.UP, .5));
    genes.push(getGene(82, OUTPUT.UP, 1));
    genes.push(getGene(83, OUTPUT.UP, .5));
    genes.push(getGene(84, OUTPUT.UP, .5));

    genes.push(getGene(92, OUTPUT.UP, .5));
    genes.push(getGene(93, OUTPUT.UP, .5));
    genes.push(getGene(94, OUTPUT.UP, .5));

    // right
    genes.push(getGene(26, OUTPUT.RIGHT, .8));
    genes.push(getGene(37, OUTPUT.RIGHT, .8));
    genes.push(getGene(48, OUTPUT.RIGHT, 1));
    genes.push(getGene(59, OUTPUT.RIGHT, 1));
    genes.push(getGene(70, OUTPUT.RIGHT, 1));
    genes.push(getGene(81, OUTPUT.RIGHT, .8));
    genes.push(getGene(92, OUTPUT.RIGHT, .8));

    genes.push(getGene(36, OUTPUT.RIGHT, .5));
    genes.push(getGene(47, OUTPUT.RIGHT, .5));
    genes.push(getGene(58, OUTPUT.RIGHT, 1));
    genes.push(getGene(70, OUTPUT.RIGHT, .5));
    genes.push(getGene(81, OUTPUT.RIGHT, .5));

    genes.push(getGene(46, OUTPUT.RIGHT, .5));
    genes.push(getGene(57, OUTPUT.RIGHT, .5));
    genes.push(getGene(68, OUTPUT.RIGHT, .5));
    
    // left
    genes.push(getGene(28, OUTPUT.LEFT, .8));
    genes.push(getGene(39, OUTPUT.LEFT, .8));
    genes.push(getGene(50, OUTPUT.LEFT, 1));
    genes.push(getGene(61, OUTPUT.LEFT, 1));
    genes.push(getGene(72, OUTPUT.LEFT, 1));
    genes.push(getGene(83, OUTPUT.LEFT, .8));
    genes.push(getGene(94, OUTPUT.LEFT, .8));

    genes.push(getGene(40, OUTPUT.LEFT, .5));
    genes.push(getGene(51, OUTPUT.LEFT, .5));
    genes.push(getGene(62, OUTPUT.LEFT, 1));
    genes.push(getGene(73, OUTPUT.LEFT, .5));
    genes.push(getGene(84, OUTPUT.LEFT, .5))
    
    genes.push(getGene(52, OUTPUT.LEFT, .5));
    genes.push(getGene(63, OUTPUT.LEFT, .5));
    genes.push(getGene(74, OUTPUT.LEFT, .5));
    
    // up neg
    genes.push(getGene(47, OUTPUT.UP, -.3));
    genes.push(getGene(48, OUTPUT.UP, -2));
    genes.push(getGene(49, OUTPUT.UP, -2));
    genes.push(getGene(50, OUTPUT.UP, -2));
    genes.push(getGene(51, OUTPUT.UP, -.3));

    genes.push(getGene(37, OUTPUT.UP, -.9));
    genes.push(getGene(38, OUTPUT.UP, -1.1));
    genes.push(getGene(39, OUTPUT.UP, -.9));

    genes.push(getGene(26, OUTPUT.UP, -.5));
    genes.push(getGene(27, OUTPUT.UP, -.6));
    genes.push(getGene(28, OUTPUT.UP, -.5));

    // down neg
    genes.push(getGene(69, OUTPUT.DOWN, -.3));
    genes.push(getGene(70, OUTPUT.DOWN, -2))
    genes.push(getGene(71, OUTPUT.DOWN, -2));
    genes.push(getGene(72, OUTPUT.DOWN, -2))
    genes.push(getGene(73, OUTPUT.DOWN, -.3));

    genes.push(getGene(81, OUTPUT.DOWN, -.9));
    genes.push(getGene(82, OUTPUT.DOWN, -1.1))
    genes.push(getGene(83, OUTPUT.DOWN, -.9));

    genes.push(getGene(92, OUTPUT.DOWN, -.5));
    genes.push(getGene(93, OUTPUT.DOWN, -.6));
    genes.push(getGene(94, OUTPUT.DOWN, -.5));

    // left neg
    genes.push(getGene(37, OUTPUT.LEFT, -.3));
    genes.push(getGene(48, OUTPUT.LEFT, -2))
    genes.push(getGene(59, OUTPUT.LEFT, -2));
    genes.push(getGene(70, OUTPUT.LEFT, -2))
    genes.push(getGene(81, OUTPUT.LEFT, -.3));

    genes.push(getGene(47, OUTPUT.LEFT, -.9));
    genes.push(getGene(58, OUTPUT.LEFT, -1.1))
    genes.push(getGene(60, OUTPUT.LEFT, -.9));

    genes.push(getGene(46, OUTPUT.LEFT, -.5));
    genes.push(getGene(57, OUTPUT.LEFT, -.6));
    genes.push(getGene(68, OUTPUT.LEFT, -.5));
    
    // right neg
    genes.push(getGene(39, OUTPUT.RIGHT, -.3));
    genes.push(getGene(50, OUTPUT.RIGHT, -2))
    genes.push(getGene(61, OUTPUT.RIGHT, -2));
    genes.push(getGene(72, OUTPUT.RIGHT, -2))
    genes.push(getGene(83, OUTPUT.RIGHT, -.3));

    genes.push(getGene(51, OUTPUT.RIGHT, -.9));
    genes.push(getGene(62, OUTPUT.RIGHT, -1.1))
    genes.push(getGene(73, OUTPUT.RIGHT, -.9));

    genes.push(getGene(52, OUTPUT.RIGHT, -.5));
    genes.push(getGene(63, OUTPUT.RIGHT, -.6));
    genes.push(getGene(74, OUTPUT.RIGHT, -.5));

    // random
    genes.push(getGene(1, OUTPUT.UP, .2));
    genes.push(getGene(4, OUTPUT.DOWN, -.2));
    genes.push(getGene(6, OUTPUT.LEFT, .2));
    genes.push(getGene(12, OUTPUT.RIGHT, .2));
    genes.push(getGene(20, OUTPUT.UP, .2));
    genes.push(getGene(21, OUTPUT.DOWN, -.2));
    genes.push(getGene(25, OUTPUT.LEFT, -.2));
    genes.push(getGene(29, OUTPUT.RIGHT, .2));

    genes.push(getGene(34, OUTPUT.UP, -.2));
    genes.push(getGene(35, OUTPUT.DOWN, .2));
    genes.push(getGene(40, OUTPUT.LEFT, .2));
    genes.push(getGene(42, OUTPUT.RIGHT, .2));
    genes.push(getGene(45, OUTPUT.UP, .2));
    genes.push(getGene(47, OUTPUT.DOWN, -.2));
    genes.push(getGene(51, OUTPUT.LEFT, -.2));
    genes.push(getGene(53, OUTPUT.RIGHT, .2));

    genes.push(getGene(58, OUTPUT.UP, .2));
    genes.push(getGene(62, OUTPUT.DOWN, .2));
    genes.push(getGene(63, OUTPUT.LEFT, -.2));
    genes.push(getGene(66, OUTPUT.RIGHT, .2));
    genes.push(getGene(71, OUTPUT.UP, .2));
    genes.push(getGene(73, OUTPUT.DOWN, -.2));
    genes.push(getGene(76, OUTPUT.LEFT, -.2));
    genes.push(getGene(80, OUTPUT.RIGHT, -.2));

    genes.push(getGene(82, OUTPUT.UP, .2));
    genes.push(getGene(84, OUTPUT.DOWN, .2));
    genes.push(getGene(87, OUTPUT.LEFT, -.2));
    genes.push(getGene(90, OUTPUT.RIGHT, -.2));
    genes.push(getGene(92, OUTPUT.UP, -.2));
    genes.push(getGene(95, OUTPUT.DOWN, .2));
    genes.push(getGene(100, OUTPUT.LEFT, -.2));
    genes.push(getGene(102, OUTPUT.RIGHT, -.2));

    genes.push(getGene(104, OUTPUT.UP, -.2));
    genes.push(getGene(107, OUTPUT.DOWN, .2));
    genes.push(getGene(110, OUTPUT.LEFT, .2));
    genes.push(getGene(113, OUTPUT.RIGHT, -.2));
    genes.push(getGene(114, OUTPUT.UP, .2));
    genes.push(getGene(118, OUTPUT.DOWN, -.2));
    genes.push(getGene(119, OUTPUT.LEFT, -.2));
    genes.push(getGene(121, OUTPUT.RIGHT, -.2));

    return genes;
  }

  return {
    get: get
  };
}());