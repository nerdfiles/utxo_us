'use strict';

/**
 * @ngdoc directive
 * @name utxoPmc.directive:djangoContentGrabber
 * @description
 * # djangoContentGrabber
 */
angular.module('utxoPmc')
  .directive('djangoContentGrabber', function ($http) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var url = '/terms/2015/08/31/terms-v1/';
        /*
         *$http.get(url).success(function (responseData) {
         *  //$('.app--entry').html(responseData);
         *  console.dir(responseData);
         *});
         */
      }
    };
  });
