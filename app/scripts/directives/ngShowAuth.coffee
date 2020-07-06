###*
@ngdoc function
@name utxoPmc.directive:ngShowAuth
@description
# ngShowAuthDirective
A directive that shows elements only when user is logged in. It also waits for Auth
to be initialized so there is no initial flashing of incorrect state.
###
angular.module("utxoPmc").directive "ngShowAuth", [
  "Auth"
  "$timeout"
  (Auth, $timeout) ->
    "use strict"
    return (
      restrict: "A"
      link: (scope, el) ->
        # hide until we process it
        update = ->
          
          # sometimes if ngCloak exists on same element, they argue, so make sure that
          # this one always runs last for reliability
          $timeout (->
            el.toggleClass "ng-cloak", not Auth.$getAuth()
            return
          ), 0
          return
        el.addClass "ng-cloak"
        Auth.$onAuth update
        update()
        return
    )
]
