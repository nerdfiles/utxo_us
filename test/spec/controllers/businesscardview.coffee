'use strict'

describe 'Controller: BusinesscardviewCtrl', ->

  # load the controller's module
  beforeEach module 'utxoPmc'

  BusinesscardviewCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    BusinesscardviewCtrl = $controller 'BusinesscardviewCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
