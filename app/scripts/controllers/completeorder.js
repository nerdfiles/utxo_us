'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:CompleteorderCtrl
 * @description
 * # CompleteorderCtrl
 * Controller of the utxoPmc
 */
angular.module('utxoPmc')
  .controller('CompleteorderCtrl', function ($scope, person, $location, $timeout, authentication) {
    $scope.person = null;
    $scope.loaded = false;
    authentication.loadSession().then(function () {
      $timeout(function () {
        $scope.person = person.current;
        $scope.loaded = true;
        $scope.$apply();
      }, 0);
    });

    $scope.updatePerson = function (_person) {
      $timeout(function () {
        $location.path('/215392070d0af07833020abdafc605d1821912b3');
      }, 2000);
    };
  });
