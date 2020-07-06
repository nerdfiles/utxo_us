"use strict"

###*
@ngdoc function
@name utxoPmc.controller:TakeselfieCtrl
@description
# TakeselfieCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "TakeselfieCtrl", ($scope, person, $location) ->
  $scope.person = person.current
  $scope.updatePerson = (_person) ->
    $location.path "/takeSelfieConfirm"
    return

  return

