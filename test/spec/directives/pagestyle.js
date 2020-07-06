'use strict';

describe('Directive: pageStyle', function () {

  // load the directive's module
  beforeEach(module('utxoPmc'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<page-style></page-style>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the pageStyle directive');
  }));
});
