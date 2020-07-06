'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:VerifyfourCtrl
 * @description
 * # VerifyfourCtrl
 * Controller of the utxoPmc that simply redirects the user.
 */
angular.module('utxoPmc')
  .controller('VerifyfourCtrl', function ($scope, person, $timeout, $location) {
    $timeout(function () {
      $location.path('/' + 'placeOrder'.stylize('hash')); //" e24a4f9e18cf2fbba29b82d9b6b899aff70e10ea";
    }, 1000)
  });
