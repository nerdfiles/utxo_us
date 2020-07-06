"use strict"

###*
@ngdoc function
@name utxoPmc.controller:VerifyfourCtrl
@description
# VerifyfourCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "VerifyfourCtrl", ($scope, person, $timeout, $location) ->
  $timeout (->
    $location.path "/" + "placeOrder".stylize("hash") #" e24a4f9e18cf2fbba29b82d9b6b899aff70e10ea";
    return
  ), 1000
  return

