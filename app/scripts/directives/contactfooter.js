'use strict';

/**
 * @ngdoc directive
 * @name utxoPmc.directive:contactFooter
 * @description
 * # contactFooter
 */
angular.module('utxoPmc')
  .directive('contactFooter', function () {
    return {
      templateUrl: '/static/contact-footer.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
