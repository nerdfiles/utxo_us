'use strict';

describe('Service: browser', function () {

  // load the service's module
  beforeEach(module('utxoPmc'));

  // instantiate service
  var browser;
  beforeEach(inject(function (_browser_) {
    browser = _browser_;
  }));

  it('should do something', function () {
    expect(!!browser).toBe(true);
  });

});
