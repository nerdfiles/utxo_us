"use strict"

###*
@ngdoc function
@name utxoPmc.controller:TakeselfieconfirmCtrl
@description
# TakeselfieconfirmCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "TakeselfieconfirmCtrl", ($scope, $location, $window, person, $timeout, crypto) ->
  el = (id) ->
    document.querySelector "#" + id
  readImage = ->
    if @files and @files[0]
      FR = new FileReader()
      FR.onload = (e) ->
        el("img").src = e.target.result
        $scope.person.order.selfie_link = e.target.result
        return

      FR.readAsDataURL @files[0]
    return
  $scope.person = {}
  angular.element(document).ready ->
    try
      el("cameraInput").addEventListener "change", readImage, false
    catch e
      console.log e
    return

  _id = null
  if person and person.current
    _id = person.current.$id
    
    #_id = '-JybI6ecfSk4UXIbO0kd';
    $scope.person = person.current
  $scope.remove = ->
    angular.element(document).ready ->
      
      #var $ngPiv = $('.selfie-snapshot img');
      $scope.person.order.selfie_link = ""
      console.log $ngPiv
      $ngPiv.remove()
      return

    return

  $scope.$watch "person.order.selfie_link", (newVal, oldVal) ->
    if newVal
      $timeout (->
        $scope.person.order.selfie_link = newVal
        $scope.$apply()
        return
      ), 0
      angular.element(document).ready ->
        $ngCamera = angular.element(document.querySelector("#ng-camera-action"))
        $ngCamera.text "re-take"
        return

    return

  $scope.viewerHeight = $window.innerHeight / 1.15
  $scope.is_iOS = ((if navigator.userAgent.match(/(iPad|iPhone|iPod)/g) then true else false))
  $scope.viewerWidth = (if ($scope.is_iOS isnt true) then ($window.innerWidth / 2) else $window.innerWidth)
  $scope.updatePerson = (_person) ->
    l = moment(person.current.order.timestamp).toString()
    _person.order.paid = "true"
    strategy =
      handle: _id
      property: "orders" + "/" + crypto.hash(l)
      payload: _person.order

    person.order(strategy).then ((orderData) ->
      console.log orderData
      console.log $scope.person
      $location.path "/completeOrder"
      return
    ), (errorData) ->
      $location.path "/error"
      return

    return

  return

