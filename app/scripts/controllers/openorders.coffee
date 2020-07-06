"use strict"

###*
@ngdoc function
@name utxoPmc.controller:OpenordersCtrl
@description
# OpenordersCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "OpenordersCtrl", ($scope, person, $location, $timeout, authentication) ->
  $scope.person = null
  $scope.loaded = false
  authentication.loadSession().then ->
    $scope.person = person.current
    _id = null
    if person and person.current
      _id = person.current.$id
      $scope.person = person.current
    else
      $location.path "/"
    __orders = $scope.person.orders
    orders = _.map(__orders, (orderItem, key) ->
      orderItem.$$id = key
      orderItem
    )
    _orders = _.toArray(orders)
    _.forEach _orders, (order, key) ->
      order.timestamp = new Date(order.timestamp)
      return

    _orders.sort (a, b) ->
      b.timestamp - a.timestamp

    $timeout (->
      $scope.$apply ->
        $scope.orders = _orders
        $scope.loaded = true
        console.dir $scope.orders
        return

      return
    ), 0
    return

  $scope.resumeOrderProcess = (orderItem, $id) ->
    
    #
    #       *console.log(orderItem);
    #       *console.log($id);
    #       
    
    #
    #       *var strategy = {
    #       *  handle   : _id,
    #       *  property : 'orders' + '/' + $id,
    #       *  payload  : orderItem
    #       *};
    #       
    
    #person.order(strategy).then(function (orderData) {
    if not orderItem.btc_address or not orderItem.string_construct
      $scope.openSelfieSessionOrder orderItem
      return
    unless orderItem.selfie_link
      delete orderItem.$$id

      delete orderItem.$$hashKey

      person.current.order = orderItem
      $location.path "/takeSelfie"
      return

  
  #
  #       *}, function (errorData) {
  #       *  $location.path('/error');
  #       *});
  #       
  $scope.openSelfieSessionOrder = (orderItem) ->
    delete orderItem.$$id

    delete orderItem.$$hashKey

    person.current.order = orderItem
    $location.path "/refNumber"
    return

  $scope.openOrderFilter = (orderItem) ->
    
    ###*
    Only show open orders, which will have an initial state of 0.
    ###
    parseInt(orderItem.status) is 0

  return

