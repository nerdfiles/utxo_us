"use strict"

###*
@ngdoc function
@name utxoPmc.controller:ChatCtrl
@description
# ChatCtrl

Unused at the moment.
###
angular.module("utxoPmc").controller "ChatCtrl", ($scope, Ref, $firebaseArray, $timeout) ->
  _alert = (msg) ->
    $scope.err = msg
    $timeout (->
      $scope.err = null
      return
    ), 5000
    return
  $scope.messages = $firebaseArray(Ref.child("messages").limitToLast(10))
  $scope.messages.$loaded()["catch"] _alert
  $scope.addMessage = (newMessage) ->
    $scope.messages.$add(text: newMessage)["catch"] _alert  if newMessage
    return

  return

