'use strict';

describe('Service: bank', function () {

  // load the service's module
  beforeEach(module('utxoPmc'));

  // instantiate service
  var bank;
  beforeEach(inject(function (_bank_) {
    bank = _bank_;
  }));

  it('should do something', function () {
    expect(!!bank).toBe(true);
  });

});
