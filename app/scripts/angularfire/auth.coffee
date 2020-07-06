(->
  "use strict"
  angular.module("firebase.auth", [
    "firebase"
    "firebase.ref"
  ]).factory "Auth", ($firebaseAuth, Ref) ->
    $firebaseAuth Ref

  return
)()
