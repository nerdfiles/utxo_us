"use strict"

###*
@ngdoc directive
@name utxoPmc.directive:pageStyle
@description
# pageStyle
###
angular.module("utxoPmc").directive "pageStyle", ->
  classes = undefined
  parent$ = undefined
  parentClasses = undefined
  restrict: "A"
  link: postLink = ($scope, element, attrs) ->
    classes = attrs.class
    parent$ = element.parent()
    parentClasses = parent$[0].className
    parent$.addClass classes
    oldParentClasses = undefined
    $scope.$on "$locationChangeStart", (newUrl) ->
      classes = attrs.class
      parent$ = element.parent()
      parentClasses = parent$[0].className
      oldParentClasses = parent$[0].className
      i = 0

      while i < parentClasses
        console.log parentClasses
        ++i
      parent$.addClass parentClasses
      return

    $scope.$on "$locationChangeSuccess", (newUrl) ->
      classes = attrs.class
      parent$ = element.parent()
      parentClasses = parent$[0].className
      parent$.addClass classes
      return

    return

