'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:RefnumberCtrl
 * @description
 * # RefnumberCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .directive('ngSetFocus', function () {
    return {
      restrict: 'A',
      link: function ($scope, element) {
        //$place_sig__btc_address = angular.element(document.querySelector('#place_sig__btc_address'));
        $(element).trigger('focus');
      }
    };
  })
  .controller('RefnumberCtrl', function ($scope, person, $location, crypto) {
    $scope.person = {};

    $scope._id = null;

    if (person && person.current) {
      $scope._id = person.current.$id;
      $scope.person = person.current;
    }

    if (person && person.current && person.current.data && person.current.data.data) {
      $scope._id = person.current.data.data.name;
    }

    $scope.$watch('person.order.btc_address', function (newVal) {
      if (newVal) {
        var last5 = $scope.person.order.btc_address.slice(-5);
        var c = new Chance();
        var string_construct = c.string({ length: 6 });
        $scope.last5 = last5;
        $scope.string_construct = string_construct;
      }
    });

    $scope.updatePerson = function (_person) {
      try {
        _person.order.last5 = person.current.order.last5 = $scope.last5;
        _person.order.string_construct = person.current.order.string_construct = $scope.string_construct;
      } catch (e) {
        $location.path('/e24a4f9e18cf2fbba29b82d9b6b899aff70e10ea');
      }

      var l = moment(person.current.order.timestamp).toString();

      var strategy = {
        handle   : $scope._id,
        property : 'orders' + '/' + crypto.hash(l),
        payload  : _person.order
      };

      person.order(strategy).then(function (orderData) {
        /*
         *console.log(orderData);
         *console.log($scope.person);
         */

        $location.path('/takeSelfie');
      }, function (errorData) {
        $location.path('/error');
      });

    };

  });
