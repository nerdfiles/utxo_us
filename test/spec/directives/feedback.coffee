'use strict'

describe 'Directive: feedback', ->

  # load the directive's module
  beforeEach module 'utxoPmc'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<feedback></feedback>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the feedback directive'
