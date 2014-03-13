
var Mode = require('../');
var assert = require('assert');

describe('stat-mode', function () {

  it('should export the `Mode` constructor', function () {
    assert.equal('function', typeof Mode);
    assert.equal('Mode', Mode.name);
  });

  describe('Mode', function () {

    it('should return a `Mode` instance with `new`', function () {
      var m = new Mode({});
      assert(m instanceof Mode);
    });

    it('should return a `Mode` instance without `new`', function () {
      var m = Mode({});
      assert(m instanceof Mode);
    });

    it('should throw an Error if no `stat` object is passed in', function () {
      try {
        new Mode();
        assert(false, 'unreachable');
      } catch (e) {
        assert.equal('must pass in a "stat" object', e.message);
      }
    });

  });

});
