'use strict';

describe('Directive: contactFooter', function () {

  // load the directive's module
  beforeEach(module('utxoPmc'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<contact-footer></contact-footer>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the contactFooter directive');
  }));
});
