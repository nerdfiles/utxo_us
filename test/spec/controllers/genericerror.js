'use strict';

describe('Controller: GenericerrorCtrl', function () {

  // load the controller's module
  beforeEach(module('utxoPmc'));

  var GenericerrorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GenericerrorCtrl = $controller('GenericerrorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
