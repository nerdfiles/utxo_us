"use strict"

###*
@ngdoc function
@name utxoPmc.controller:MapviewCtrl
@description
# MapviewCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "MapviewCtrl", ($scope, $http, Geocoder, $geolocation, $timeout, person, $window, authentication, $location, $rootScope, map, localStorageService) ->
  $scope.person = {}
  $scope.isAfterdark = person.isAfterdark() isnt true
  $scope.pageStyle = (if $scope.isAfterdark then "full-height" else "")
  $scope._$map = null
  $scope.$on "isAfterdark:ready", ->

  transactionDetails = undefined
  $scope.passOn = (position, query) ->
    
    ###*
    @param position Coords, etc.
    ###
    devicePosition = undefined
    center = {}
    _position = undefined
    try
      resultSet = position.data.results[0]
      _position =
        lat: resultSet.geometry.location.lat
        lng: resultSet.geometry.location.lng
    catch e
      console.log e
    try
      devicePosition =
        lat: position.coords.latitude
        lng: position.coords.longitude
    catch e
      console.log e
    try
      center.lat = (if (devicePosition and devicePosition.lat) then devicePosition.lat else _position.lat)
      center.lng = (if (devicePosition and devicePosition.lng) then devicePosition.lng else _position.lng)
    catch e
      console.dir e
    $scope.person = person.current
    if $scope.person.order
      transactionDetails =
        depositSlip: "USD" + numeral($scope.person.order.usd).format("0,00") + " for " + parseFloat($scope.person.order.btc).toFixed(2) + "BTC"
        organizationName: "The CryptoStandard, LLC."
        routingNumber: "28-2938"
        accountNumber: "29849839"
        isAfterdark: $scope.isAfterdark
    
    ###*
    @note Under isAfterdark setting, discovered_address will not be provided.
    ###
    person.current.transactionDetails = transactionDetails  if $scope.isAfterdark
    Geocoder.getPlaces(query, center, transactionDetails, $scope._$map, person.current.order).then (responseData) ->
      mapData = responseData.map
      marker = new google.maps.Marker(
        map: mapData
        position: center
        icon:
          url: "/static/images/icons/street-view_000000_24.png"
          anchor: new google.maps.Point(24, 24)
          scaledSize: new google.maps.Size(24, 24)
      )
      return

    return

  angular.element(document).ready ->
    $scope._$map = document.querySelector("#map")
    $map = $($scope._$map)
    $scope.$on "$locationChangeStart", ->
      $($map).remove()
      return

    $timeout (->
      $map.height $window.innerHeight
      $map.width $window.innerWidth
      return
    ), 0
    return

  $scope.$watch "noLocationAvailable", (newVal, oldVal) ->
    if newVal is true
      if $scope.person.order
        transactionDetails =
          depositSlip: "USD" + numeral($scope.person.order.usd).format("0,00") + " for " + parseFloat($scope.person.order.btc).toFixed(2) + "BTC"
          organizationName: "The CryptoStandard, LLC."
          routingNumber: "28-2938"
          accountNumber: "29849839"
          isAfterdark: $scope.isAfterdark
      person.current.transactionDetails = transactionDetails
      $location.path "/noLocationAvailable"
    return

  authentication.loadSession().then (detailView = ->
    
    #$http.get(environment.rest.maps.index).then(function(mapConstruct) {
    
    #var data = _.extend({}, mapConstruct.data);
    query = "credit+unions+near+Houston+dir+Houston"
    center = undefined
    details = undefined
    scrapeUrl = authentication.scrapeUrl + person.current.verification.address_postal_code
    try
      $http.get(scrapeUrl).success((responseData) ->
        $rootScope.locales = responseData.data
        return
      ).error (errorData) ->
        console.log errorData
        return

    catch e
      console.dir e
    $scope.$broadcast "isAfterdark:ready", true  if $scope.isAfterdark
    $scope.noLocationAvailable = false
    pa = (if person.current.order.physical_address then person.current.order.physical_address else localStorageService.get("pa"))
    pa_test = localStorageService.get("pa")
    unitedStatesLocationConstruct = null
    if person.current and person.current.order and person.current.order.physical_address
      
      ###*
      Location Provided
      
      @input physical_address # Inline unit test for user address entry field.
      @description Location Provided by the user will trigger the given map route,
      and the user will be centered at a Google blessed Geocoded address.
      ###
      map.Owlish.verifyAddress(pa).then (position) ->
        console.log position
        $scope.passOn position, query
        return

      return
    else
      
      ###*
      Get Current Position
      
      @description The device probably has a GPS.
      ###
      $geolocation.getCurrentPosition(timeout: 60000).then ((position) ->
        $scope.passOn position, query
        $scope.noLocationAvailable = false
        return
      ), ->
        $scope.noLocationAvailable = true
        console.log "Person Current Location Provided."
        return

    return
  
  #});
  ), (errorData) ->
    $location.path "/"
    return

  return

