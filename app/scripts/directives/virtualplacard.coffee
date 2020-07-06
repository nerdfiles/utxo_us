"use strict"

###*
@ngdoc directive
@name utxoPmc.directive:virtualPlacard
@description
# virtualPlacard
###

#authentication.loadSession().then(function () {

# First order.

#});
angular.module("utxoPmc").directive("virtualPlacard", ($location, person, crypto, authentication) ->
  restrict: "A"
  templateUrl: "/static/virtual-placard.html"
  controller: ($scope) ->
    $scope._id = null
    $scope._id = person.current.$id  if person and person.current
    return

  link: postLink = ($scope, element, attrs) ->
    $scope.loadRefNumber = ->
      $location.path "/refNumber"
      $location.replace()
      return

    $scope._loadRefNumber = ->
      person.current.order.cheesed = "true"
      l = person.current.order.timestamp
      strategy =
        handle: $scope._id
        property: "orders" + "/" + crypto.hash(l)
        payload: person.current.order

      person.order(strategy).then ((orderData) ->
        d = orderData.data.data
        h = {}
        _h = crypto.hash(d.timestamp)
        h[_h] = d
        if _.size(person.current.orders) > 0
          person.current.orders = _.merge({}, person.current.orders, h)
        else
          person.current.orders = _.extend({}, h)
        return
      ), (errorData) ->

      return

    $scope._loadRefNumber()
    return
).directive "cheeseCounter", ($location, person, authentication, $timeout) ->
  restrict: "A"
  templateUrl: "/static/cheese-counter.html"
  require: "^virtualPlacard"
  link: postLink = ($scope, element, attrs) ->
    cachedPerson = person.current
    $scope.loaded = false
    authentication.loadSession().then (sessionPerson) ->
      t = null
      if cachedPerson.order isnt null
        t = (if (cachedPerson.order.updated__time) then cachedPerson.order.updated__time else cachedPerson.order.timestamp)
      else
        t = (if (sessionPerson.order.updated__time) then sessionPerson.order.updated__time else sessionPerson.order.timestamp)
      modifiedCountdownBase = new Date(t).getTime() + 2700000
      $timeout (->
        $(".cheese--countdown").countdown(modifiedCountdownBase,
          elapse: true
        ).on "update.countdown", (event) ->
          $this = $(this)
          expired = false
          $scope.loaded = true
          $scope.duration = event.strftime("%M:%S")
          $this.html $scope.duration
          return

        return
      ), 750
      return

    return

