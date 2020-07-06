"use strict"

###*
@ngdoc function
@name utxoPmc.controller:TermsCtrl
@description
# TermsCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "TermsCtrl", ($scope, person, $location, authentication) ->
  $scope.person = person.current
  _id = null
  _id = person.current.$id  if person and person.current
  $scope.updatePerson = (_person) ->
    _property = "overview"
    _person.overview.terms = "true"
    strategy =
      handle: _id
      property: _property
      payload: _person[_property]

    person.write(strategy).then ((_personData) ->
      person.current.overview.terms = "true"
      $location.path "/verifyOne"
      return
    ), (errorData) ->
      $location.path "/error"
      console.log errorData
      return

    return

  return

