
var Mode = require('../');
var assert = require('assert');

describe('stat-mode', function () {

  it('should export the `Mode` constructor', function () {
    assert.equal('function', typeof Mode);
    assert.equal('Mode', Mode.name);
  });

});
