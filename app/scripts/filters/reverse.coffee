"use strict"
angular.module("utxoPmc").filter "reverse", ->
  (items) ->
    (if angular.isArray(items) then items.slice().reverse() else [])

