"use strict"

###*
@ngdoc function
@name utxoPmc.controller:HistoryCtrl
@description
# HistoryCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "HistoryCtrl", ($scope, person, authentication, NgTableParams) ->
  $scope.person = null
  
  #var tp = new NgTableParams({}, { getData: getData });
  $scope.tableParams = null
  $scope.$on "orders:ready", ->
    $scope.tableParams = new NgTableParams(
      count: 10
    ,
      filterDelay: 0
      data: $scope.orders
    )
    return

  $scope.loaded = false
  authentication.loadSession().then ->
    $scope.person = person.current
    orders = $scope.person.orders or []
    _orders = _.toArray(orders)
    _.forEach _orders, (order) ->
      order.timestamp = new Date(order.timestamp)
      return

    _orders.sort (a, b) ->
      b.timestamp - a.timestamp

    $scope.orders = _orders
    $scope.loaded = true
    $scope.$broadcast "orders:ready", _orders
    $scope.historyOrderFilter = (orderItem) ->
      
      ###*
      Only show "closed" orders, which will have any other state than the initial.
      ###
      parseInt(orderItem.status) isnt 0

    return

  return

