"use strict"

###*
@ngdoc directive
@name utxoPmc.directive:contactFooter
@description
# contactFooter
###
angular.module("utxoPmc").directive "contactFooter", ->
  templateUrl: "/static/contact-footer.html"
  restrict: "A"
  link: postLink = (scope, element, attrs) ->

