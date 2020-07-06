"use strict"

###*
@ngdoc function
@name utxoPmc.controller:RefnumberCtrl
@description
# RefnumberCtrl
Controller of the utxoPmc
###

#$place_sig__btc_address = angular.element(document.querySelector('#place_sig__btc_address'));
angular.module("utxoPmc").directive("ngSetFocus", ->
  restrict: "A"
  link: ($scope, element) ->
    $(element).trigger "focus"
    return
).controller "RefnumberCtrl", ($scope, person, $location, crypto) ->
  $scope.person = {}
  _id = null
  if person and person.current
    _id = person.current.$id
    
    #_id = '-JybI6ecfSk4UXIbO0kd';
    $scope.person = person.current
  $scope.$watch "person.order.btc_address", (newVal) ->
    if newVal
      last5 = $scope.person.order.btc_address.slice(-5)
      c = new Chance()
      string_construct = c.string(length: 6)
      $scope.last5 = last5
      $scope.string_construct = string_construct
    return

  $scope.updatePerson = (_person) ->
    try
      _person.order.last5 = person.current.order.last5 = $scope.last5
      _person.order.string_construct = person.current.order.string_construct = $scope.string_construct
    catch e
      $location.path "/e24a4f9e18cf2fbba29b82d9b6b899aff70e10ea"
    l = moment(person.current.order.timestamp).toString()
    strategy =
      handle: _id
      property: "orders" + "/" + crypto.hash(l)
      payload: _person.order

    person.order(strategy).then ((orderData) ->
      
      #
      #         *console.log(orderData);
      #         *console.log($scope.person);
      #         
      $location.path "/takeSelfie"
      return
    ), (errorData) ->
      $location.path "/error"
      return

    return

  return

