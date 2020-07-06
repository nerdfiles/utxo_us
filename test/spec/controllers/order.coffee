'use strict'

describe 'Controller: OrderCtrl', ->

  # load the controller's module
  beforeEach module 'utxoPmc'

  OrderCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    OrderCtrl = $controller 'OrderCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
