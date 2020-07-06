"use strict"

###*
@ngdoc function
@name utxoPmc.controller:ContactCtrl
@description
# ContactCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "ContactCtrl", ($scope, $timeout, notification, crypto) ->
  $scope.addMessage = (message_construct) ->
    $scope.showConfirmation = true
    UserInfo.getInfo ((data) ->
      id = crypto.hash(data.ip_address)
      notification.postMessage id.slice(0, 9) + ": " + message_construct
      return
    ), (err) ->

    $timeout (->
      $scope.showConfirmation = false
      return
    ), 3000
    return

  return

