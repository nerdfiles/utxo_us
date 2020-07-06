'use strict';

describe('Service: map', function () {

  // load the service's module
  beforeEach(module('utxoPmc'));

  // instantiate service
  var map;
  beforeEach(inject(function (_map_) {
    map = _map_;
  }));

  it('should do something', function () {
    expect(!!map).toBe(true);
  });

});
