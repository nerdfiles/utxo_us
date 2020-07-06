'use strict';

describe('Controller: VerifyoneCtrl', function () {

  // load the controller's module
  beforeEach(module('utxoPmc'));

  var VerifyoneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VerifyoneCtrl = $controller('VerifyoneCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
