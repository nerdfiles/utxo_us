'use strict';

describe('Directive: bitcoinPrice', function () {

  // load the directive's module
  beforeEach(module('utxoPmc'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bitcoin-price></bitcoin-price>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bitcoinPrice directive');
  }));
});
