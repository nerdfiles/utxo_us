"use strict"

###*
@ngdoc directive
@name utxoPmc.directive:customEnter
@description
# customEnter
###
angular.module("utxoPmc").directive "customEnter", ->
  restrict: "A"
  link: postLink = ($scope, element, attrs) ->
    element.bind "keyup", (e) ->
      if e.which is 13
        $scope.$apply()
        $scope.$eval attrs.customEnter
        return
      e.preventDefault()
      return

    return

