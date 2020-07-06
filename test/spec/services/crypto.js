'use strict';

describe('Service: crypto', function () {

  // load the service's module
  beforeEach(module('utxoPmc'));

  // instantiate service
  var crypto;
  beforeEach(inject(function (_crypto_) {
    crypto = _crypto_;
  }));

  it('should do something', function () {
    expect(!!crypto).toBe(true);
  });

});
