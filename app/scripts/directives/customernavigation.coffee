"use strict"

###*
@ngdoc directive
@name utxoPmc.directive:customerNavigation
@description
# customerNavigation
###
angular.module("utxoPmc").factory("customerNavigationItem", ->
  serviceInterface = {}
  serviceInterface.knownPaths = [
    {
      alias: "placeOrder"
      desc: "Order a fresh batch of Bitcoin"
      label: "Place Order"
    }
    {
      alias: "openOrders"
      desc: "Review your existing orders"
      label: "Open Orders"
    }
    {
      alias: "history"
      desc: "Review your past orders"
      label: "History"
    }
    {
      alias: "logout"
      desc: "Logout"
      label: "Logout"
    }
  ]
  serviceInterface
).directive "customerNavigation", ($window, $location, $timeout, customerNavigationItem) ->
  templateUrl: "/static/customer-navigation.html"
  restrict: "A"
  link: postLink = ($scope, element, attrs) ->
    portSpec = (if $window.location.port isnt "" then (":" + $window.location.port) else "")
    pathname = $window.location.pathname
    a = $window.location.hostname + portSpec + pathname + "#/"
    $scope.baseUrl = $window.location.protocol + "//" + a
    $scope.knownPaths = customerNavigationItem.knownPaths
    check = (_newLocation) ->
      $timeout (->
        _.forEach customerNavigationItem.knownPaths, (pathConstruct, index) ->
          n = pathConstruct.alias.stylize("hash")
          if n is _newLocation
            pathConstruct.active = true
          else
            pathConstruct.active = false
          pathConstruct

        $scope.$apply()
        return
      ), 0
      
      #console.dir(customerNavigationItem.knownPaths);
      $scope.knownPaths = customerNavigationItem.knownPaths
      return

    location_construct = $location.path().split("/")
    _newLocation = location_construct[1]
    check _newLocation
    return

