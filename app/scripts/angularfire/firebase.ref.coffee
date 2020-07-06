angular.module("firebase.ref", [
  "firebase"
  "firebase.config"
]).factory "Ref", [
  "$window"
  "FBURL"
  ($window, FBURL) ->
    "use strict"
    return new $window.Firebase(FBURL)
]
