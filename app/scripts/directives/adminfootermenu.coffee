"use strict"

###*
@ngdoc directive
@name utxoPmc.directive:adminFooterMenu
@description
# adminFooterMenu
###
angular.module("utxoPmc").directive "adminFooterMenu", ($timeout, $window) ->
  restrict: "A"
  templateUrl: "/static/admin-footer-menu.html"
  link: postLink = ($scope, element, attrs) ->
    portSpec = (if $window.location.port isnt "" then (":" + $window.location.port) else "")
    pathname = $window.location.pathname
    console.log pathname
    a = $window.location.hostname + portSpec + pathname + "#/"
    $scope.baseUrl = $window.location.protocol + "//" + a
    $timeout ->
      $scope.$apply ->
        $(".button-collapse").sideNav closeOnClick: ->
          true

        $timeout (->
          mobileNav = angular.element("#mobile").find("a")
          
          #console.log(mobileNav);
          mobileNav.on "click", ->
            $("#sidenav-overlay").fadeOut().remove()
            mobileNav.eq(0).off "click"
            return

          return
        ), 1000
        return

      return

    return


#element.text('this is the adminFooterMenu directive');
