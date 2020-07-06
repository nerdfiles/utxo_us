'use strict';

describe('Controller: VerifythreeCtrl', function () {

  // load the controller's module
  beforeEach(module('utxoPmc'));

  var VerifythreeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VerifythreeCtrl = $controller('VerifythreeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
