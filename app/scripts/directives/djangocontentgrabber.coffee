"use strict"

###*
@ngdoc directive
@name utxoPmc.directive:djangoContentGrabber
@description
# djangoContentGrabber
###
angular.module("utxoPmc").directive "djangoContentGrabber", ($http) ->
  restrict: "A"
  link: postLink = (scope, element, attrs) ->
    url = "/terms/2015/08/31/terms-v1/"
    return


#
#         *$http.get(url).success(function (responseData) {
#         *  //$('.app--entry').html(responseData);
#         *  console.dir(responseData);
#         *});
#         
