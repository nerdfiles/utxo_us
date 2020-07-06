"use strict"

###*
@ngdoc function
@name utxoPmc.controller:NolocationavailableCtrl
@description
# NolocationavailableCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "NolocationavailableCtrl", ($scope, person, $location, $geolocation, authentication, localStorageService) ->
  $scope.person = person.current
  $scope.sendDirections = ->
    
    ###*
    @input person.order.physical_address
    ###
    person.current.locationProvided = true
    
    #authentication.loadSession().then(function () {
    pa = localStorageService.get("pa")
    pa = localStorageService.set("pa", $scope.person.order.physical_address)  unless pa
    person.current = $scope.person
    $location.path "/mapView"
    return

  return


#});
