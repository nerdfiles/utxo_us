"use strict"

###*
@ngdoc function
@name utxoPmc.controller:CompleteorderCtrl
@description
# CompleteorderCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "CompleteorderCtrl", ($scope, person, $location, $timeout, authentication) ->
  $scope.person = null
  $scope.loaded = false
  authentication.loadSession().then ->
    $timeout (->
      $scope.person = person.current
      $scope.loaded = true
      $scope.$apply()
      return
    ), 0
    $scope.updatePerson = (_person) ->
      $timeout (->
        $location.path "/215392070d0af07833020abdafc605d1821912b3"
        return
      ), 2000
      return

    return

  return

