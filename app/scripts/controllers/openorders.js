'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:OpenordersCtrl
 * @description
 * # OpenordersCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('OpenordersCtrl', function ($scope, person, $location, $timeout, authentication) {
    $scope.person = person.current || null;
    $scope.loaded = false;

    authentication.loadSession().then(function (p) {
      if (person.current && person.current.order) {
        $scope.person = person.current;
      } else {
        $scope.person = p;
      }

      console.log($scope.person);

      var
      _id = null;

      if (person && person.current) {
        _id = person.current.$id;
        $scope.person = person.current;
      } else {
        $location.path('/');
      }

      var
      __orders = $scope.person.orders,

      orders = _.map(__orders, function (orderItem, key) {
        orderItem.$$id = key;
        return orderItem;
      }),

      _orders = _.toArray(orders);

      _.forEach(_orders, function (order, key) {
        order.timestamp = new Date(order.timestamp)
      });

      _orders = _.filter(_orders, function (order) {
        //console.log(order);
        if (order.status === '1') {
          return;
        }
        return order;
      });

      if (_orders.length === 0)
        $scope.none = true;

      if (_orders.length >= 9)
        $scope.many = true;

      _orders.sort(function (a, b) {
        return b.timestamp - a.timestamp;
      });

      $scope.orders = _orders;

      $timeout(function () {
        $scope.$apply(function () {
          $scope.loaded = true;
        });
      }, 0);
    });

    $scope.resumeOrderProcess = function (orderItem, $id) {
      /*
       *console.log(orderItem);
       *console.log($id);
       */
      /*
       *var strategy = {
       *  handle   : _id,
       *  property : 'orders' + '/' + $id,
       *  payload  : orderItem
       *};
       */

      //person.order(strategy).then(function (orderData) {

      if (!orderItem.btc_address || !orderItem.string_construct) {
        $scope.openSelfieSessionOrder(orderItem);
        return;
      }

      if (!orderItem.selfie_link) {
        delete orderItem.$$id;
        delete orderItem.$$hashKey;
        person.current.order = orderItem;
        $location.path('/takeSelfie');
        return;
      }

      /*
       *}, function (errorData) {
       *  $location.path('/error');
       *});
       */

    };

    $scope.openSelfieSessionOrder = function (orderItem) {
      delete orderItem.$$id;
      delete orderItem.$$hashKey;
      person.current.order = orderItem;
      $location.path('/refNumber');
    };

  });
