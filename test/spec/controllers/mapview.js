'use strict';

describe('Controller: MapviewCtrl', function () {

  // load the controller's module
  beforeEach(module('utxoPmc'));

  var MapviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapviewCtrl = $controller('MapviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
