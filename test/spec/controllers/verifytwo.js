'use strict';

describe('Controller: VerifytwoCtrl', function () {

  // load the controller's module
  beforeEach(module('utxoPmc'));

  var VerifytwoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VerifytwoCtrl = $controller('VerifytwoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
