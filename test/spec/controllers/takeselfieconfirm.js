'use strict';

describe('Controller: TakeselfieconfirmCtrl', function () {

  // load the controller's module
  beforeEach(module('utxoPmc'));

  var TakeselfieconfirmCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TakeselfieconfirmCtrl = $controller('TakeselfieconfirmCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
