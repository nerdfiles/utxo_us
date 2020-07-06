'use strict';

/**
 * @ngdoc directive
 * @name utxoPmc.directive:customerNavigation
 * @description
 * # customerNavigation
 */
angular.module('utxoPmc')
  .factory('customerNavigationItem', function () {
    var serviceInterface = {};
    serviceInterface.knownPaths = [
      { alias: 'placeOrder', desc: 'Order a fresh batch of Bitcoin', label: 'Place Order' },
      { alias: 'openOrders', desc: 'Review your existing orders', label: 'Open Orders' },
      { alias: 'history', desc: 'Review your past orders', label: 'History' },
      { alias: 'logout', desc: 'Logout', label: 'Logout'}
    ];
    return serviceInterface;
  })
  .directive('customerNavigation', function ($window, $location, $timeout, customerNavigationItem) {
    return {
      templateUrl: '/static/customer-navigation.html',
      restrict: 'A',
      link: function postLink($scope, element, attrs) {
        var portSpec = $window.location.port != "" ? (':' + $window.location.port) : '';
        var pathname = $window.location.pathname;
        console.log(pathname);
        var a = $window.location.hostname + portSpec + pathname + '#/';
        $scope.baseUrl_i18n = $window.location.protocol + '//' + a;
        $scope.knownPaths = customerNavigationItem.knownPaths;

        var check = function (_newLocation) {
          $timeout(function () {
            _.forEach(customerNavigationItem.knownPaths, function (pathConstruct, index) {
              var n = pathConstruct.alias.stylize('hash');
              if (n === _newLocation) {
                pathConstruct.active = true;
              } else {
                pathConstruct.active = false;
              }
              return pathConstruct;
            });
            $scope.$apply();
          }, 0);
          //console.dir(customerNavigationItem.knownPaths);
          $scope.knownPaths = customerNavigationItem.knownPaths;
        };

        var location_construct = $location.path().split('/');
        var _newLocation = location_construct[1];

        check(_newLocation);

      }
    };
  });
