'use strict';

describe('Service: sound', function () {

  // load the service's module
  beforeEach(module('utxoPmc'));

  // instantiate service
  var sound;
  beforeEach(inject(function (_sound_) {
    sound = _sound_;
  }));

  it('should do something', function () {
    expect(!!sound).toBe(true);
  });

});
