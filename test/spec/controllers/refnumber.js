'use strict';

describe('Controller: RefnumberCtrl', function () {

  // load the controller's module
  beforeEach(module('utxoPmc'));

  var RefnumberCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RefnumberCtrl = $controller('RefnumberCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
