'use strict';

describe('Controller: NolocationavailableCtrl', function () {

  // load the controller's module
  beforeEach(module('utxoPmc'));

  var NolocationavailableCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NolocationavailableCtrl = $controller('NolocationavailableCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
