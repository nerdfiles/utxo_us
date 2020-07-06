'use strict';

/**
 * @ngdoc directive
 * @name utxoPmc.directive:pageStyle
 * @description
 * # pageStyle
 */
angular.module('utxoPmc')
  .directive('pageStyle', function () {

    var classes;
    var parent$;
    var parentClasses;

    return {
      restrict: 'A',
      link: function postLink($scope, element, attrs) {
        classes = attrs.class;
        parent$ = element.parent();
        parentClasses = parent$[0].className;
        parent$.addClass(classes);
        var oldParentClasses;

        $scope.$on('$locationChangeStart', function (newUrl) {
          classes = attrs.class;
          parent$ = element.parent();
          parentClasses = parent$[0].className;
          oldParentClasses = parent$[0].className;
          for (var i = 0; i < parentClasses; ++i) {
            console.log(parentClasses);
          }
          parent$.addClass(parentClasses);
        });

        $scope.$on('$locationChangeSuccess', function (newUrl) {
          classes = attrs.class;
          parent$ = element.parent();
          parentClasses = parent$[0].className;
          parent$.addClass(classes);
        });

      }
    };

  });
