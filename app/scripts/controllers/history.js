'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:HistoryCtrl
 * @description
 * # HistoryCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('HistoryCtrl', function ($scope, person, authentication, NgTableParams) {

    $scope.person = null;
    //var tp = new NgTableParams({}, { getData: getData });
    $scope.tableParams = null;

    $scope.$on('orders:ready', function () {
      $scope.tableParams = new NgTableParams({
        count: 10
      }, {
        filterDelay: 0,
        data: $scope.orders
      });
    });

    $scope.loaded = false;

    authentication.loadSession().then(function () {
      $scope.person = person.current;

      var
      __orders = $scope.person.orders || [],
      orders = _.map(__orders, function (givenOrder, keyname) {
        givenOrder.$id = keyname;
        return givenOrder;
      }),
      _orders = _.toArray(orders);

      _orders = _.filter(_orders, function (order) {
        //console.log(order);
        if (order.status === '0') {
          return;
        }
        return order;
      });

      if (_orders.length === 0)
        $scope.none = true;

      if (_orders.length >= 9)
        $scope.many = true;

      _.forEach(_orders, function (order) {
        order.timestamp = new Date(order.timestamp)
      });

      _orders.sort(function (a, b) {
        return b.timestamp - a.timestamp;
      });

      $scope.orders = _orders;
      $scope.loaded = true;

      $scope.$broadcast('orders:ready', _orders);

      $scope.historyOrderFilter = function (orderItem) {
        /**
         * Only show "closed" orders, which will have any other state than the initial.
         */
        return orderItem.status !== '0';
      };

    });
  });
