'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:VerifythreeCtrl
 * @description
 * # VerifythreeCtrl
 * Controller of the utxoPmc that simply redirects the user.
 */
angular.module('utxoPmc')
  .controller('VerifythreeCtrl', function ($scope, person, $timeout, $location) {
    $timeout(function () {
      $location.path('/verifyFour');
    }, 2000)
  });
