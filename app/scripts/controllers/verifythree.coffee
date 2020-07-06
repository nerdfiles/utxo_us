"use strict"

###*
@ngdoc function
@name utxoPmc.controller:VerifythreeCtrl
@description
# VerifythreeCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "VerifythreeCtrl", ($scope, person, $timeout, $location) ->
  $timeout (->
    $location.path "/verifyFour"
    return
  ), 2000
  return

