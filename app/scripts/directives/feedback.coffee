'use strict'

###*
 # @ngdoc directive
 # @name utxoPmc.directive:feedback
 # @description
 # # feedback
###
angular.module 'utxoPmc'
  .directive 'feedback', ->
    restrict: 'EA'
    template: '<div></div>'
    link: (scope, element, attrs) ->
      element.text 'this is the feedback directive'
