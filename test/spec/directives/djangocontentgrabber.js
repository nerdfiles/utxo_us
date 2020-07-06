'use strict';

describe('Directive: djangoContentGrabber', function () {

  // load the directive's module
  beforeEach(module('utxoPmc'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<django-content-grabber></django-content-grabber>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the djangoContentGrabber directive');
  }));
});
