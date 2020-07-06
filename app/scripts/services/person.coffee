"use strict"

###*
@ngdoc service
@name utxoPmc.person
@description
# person
Service in the utxoPmc.
###
angular.module("utxoPmc").factory("people", ($q, $http, $timeout, $cookies, notification, $location) ->
  __service__ = {}
  __service__.list = null
  __service__
).factory "person", ($q, $http, $timeout, $cookies, notification, $location, people, Auth, localStorageService, crypto) ->
  __service__ = {}
  __service__.session = {}
  
  # Persistent session.
  __service__.session.user = Auth.$getAuth()
  __service__.current = {}
  __service__.current.order = null
  __service__.sendSms = (handle, message_construct) ->
    
    ###*
    Send Arbitrary Message to Number
    ###
    baseUrl = environment.rest.sendSms.create
    def = $q.defer()
    _formObject =
      handle: handle
      message_construct: message_construct

    payload = $.param(_formObject)
    $http.post(baseUrl, payload).success((responseData) ->
      def.resolve responseData
      return
    ).error (errorData) ->
      def.reject errorData
      return

    def.promise

  __service__.isAfterdark = ->
    _now = moment().hour(18)
    __now = moment().hour(8)
    now = moment()
    now.isAfter(_now) or now.isBefore(__now)

  __service__.push = (_strategy) ->
    
    ###*
    @param {object} _strategy
    .payload {object}
    @usage
    curl -X POST -d '{"user_id" : "jack", "text" : "Ahoy!"}' \
    'https://utxo.firebaseio.com/people.json'
    @response
    { "name": "-INOQPH-aV_psbk3ZXEX" }
    ###
    payload = $.param(_strategy.payload)
    _url = (if (_strategy.property isnt null and _strategy.property isnt `undefined`) then environment.rest.people.person.__update__(_strategy.handle, _strategy.property) else environment.rest.people.person.__base__())
    $http.post(_url, payload).success((response) ->
      console.log response
      response
    ).error (errorResponse) ->
      console.log errorResponse
      errorResponse


  __service__.order = (_strategy) ->
    
    ###*
    @param {object} _strategy
    .handle   {string}
    .property {string}
    .payload  {object} A map of property-value pairs to update with values.
    @usage
    curl -X PUT -d '{ "first": "Jack", "last": "Sparrow" }' \
    'https://utxo.firebaseio.com/people/<number>/<property>.json'
    @response
    { "first": "Jack", "last": "Sparrow" }
    ###
    $location.path "/"  if _strategy.payload is `undefined`
    payload = null
    try
      payload = $.param(_strategy.payload)
    catch e
      console.dir e
    $http.put(environment.rest.orders.order.__update__(_strategy.handle, _strategy.property), payload).success((response) ->
      console.log response
      response
    ).error (errorResponse) ->
      console.log errorResponse
      errorResponse


  __service__.write = (_strategy) ->
    
    ###*
    @param {object} _strategy
    .handle   {string}
    .property {string}
    .payload  {object} A map of property-value pairs to update with values.
    @usage
    curl -X PUT -d '{ "first": "Jack", "last": "Sparrow" }' \
    'https://utxo.firebaseio.com/people/<number>/<property>.json'
    @response
    { "first": "Jack", "last": "Sparrow" }
    ###
    payload = $.param(_strategy.payload)
    $http.put(environment.rest.people.person.__update__(_strategy.handle, _strategy.property), payload).success((response) ->
      console.log response
      response
    ).error (errorResponse) ->
      console.log errorResponse
      errorResponse


  __service__.update = (_strategy) ->
    
    ###*
    @param {object} _strategy
    .handle   {string}
    .property {string}
    .payload  {object} A property-value pair.
    @usage
    curl -X PATCH -d '{"last":"Jones"}' \
    'https://utxo.firebaseio.com/people/<number>/<property>/.json'
    @response
    { "last": "Jones" }
    ###
    strategy = (if _strategy then _strategy else {})
    payload = $.param(_strategy.payload)
    $http.patch(environment.rest.people.person.__update__(_strategy.handle), payload).success((response) ->
      console.log response
      response
    ).error (errorResponse) ->
      console.log errorResponse
      errorResponse


  __service__.all = ->
    
    ###*
    Load All Users
    ###
    $http.get(environment.rest.people.person.__base__()).success((response) ->
      people.list = response
      response
    ).error (errorResponse) ->
      errorResponse


  __service__.get = (_strategy) ->
    
    ###*
    Get Person
    
    Template-based strategy to calling and capturing REST responses.
    
    @param {object} strategy
    @property mode
    @property handle
    @usage
    
    personService
    .getPerson({ mode: 'byId', handle: '{{personId}}', property: '{{propertyKey}}' })
    .then(noop, noop)
    
    @usage
    
    curl 'https://utxo.firebaseio.com/people/<number>/<property>.json'
    
    @response
    
    { "first": "Jack", "last": "Sparrow" }
    ###
    defaultStrategy = "byId"
    strategy = (if _strategy then _strategy else defaultStrategy)
    strategyConstruct = {}
    def = $q.defer()
    personData = undefined
    errorMessageConstruct = {}
    now = new Date()
    sep = "/"
    console.time strategy
    strategyConstruct.byId = ->
      
      ###*
      @inner
      ###
      personData = $http.get(environment.rest.people.person.__get__(_strategy.handle)).success((response) ->
        if response and response.data
          def.resolve response.data
        else
          def.reject {}
          console.log "Zero data for", this
        console.timeEnd "Complete:" + strategy
        return
      ).error((errorData) ->
        if errorData
          errorMessageConstruct.message = errorData.error
          errorMessageConstruct.status = errorData.status
          notification.displayError errorMessageConstruct
          def.reject errorData
        else
          errorMessageConstruct.message = "No person found."
          console.log errorMessageConstruct.message
          def.reject errorData
        console.timeEnd "Complete:" + strategy
        return
      )
      return

    strategyConstruct.byProperty = ->
      
      ###*
      @inner
      ###
      personData = $http.get(environment.rest.people.person.__get__(_strategy.handle)).success((response) ->
        if response and response.data and response.data[_strategy.property]
          def.resolve response.data[_strategy.property]
        else
          def.reject {}
          console.log "Zero data for", this
        console.timeEnd "Complete:" + strategy
        return
      ).error((errorData) ->
        errorMessageConstruct.message = errorData.error
        errorMessageConstruct.status = error.status
        notification.displayError errorMessageConstruct
        def.reject errorData
        console.timeEnd "Complete:" + strategy
        return
      )
      return

    initializeStrategy = undefined
    initializeStrategy = strategyConstruct[strategy.mode]  if typeof strategyConstruct[strategy.mode] is "function"
    try
      initializeStrategy()
    catch e
      console.log e
    def.promise

  __service__

