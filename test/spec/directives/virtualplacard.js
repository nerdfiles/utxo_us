'use strict';

describe('Directive: virtualPlacard', function () {

  // load the directive's module
  beforeEach(module('utxoPmc'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<virtual-placard></virtual-placard>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the virtualPlacard directive');
  }));
});
