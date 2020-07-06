"use strict"

###*
@ngdoc factory
@name utxoPmc.notification
@description
# notification
factory in the utxoPmc.
###
angular.module("utxoPmc").factory "notification", ($http) ->
  __interface__ = {}
  current_error_content = null
  __interface__.currentStatus = null
  __interface__.logglyQueue = []
  __interface__.cancelTransfer = false
  __interface__.postMessage = (message_construct) ->
    _formObject = message_construct: message_construct
    payload = $.param(_formObject)
    _url = environment.rest.help
    $http.post(_url, payload).success((response) ->
      console.log response
      return
    ).error (errorResponse) ->
      console.log errorResponse
      return


  __interface__.displayError = (errorData) ->
    
    ###*
    ###
    return

  __interface__.displayNote = (noteData) ->
    
    ###*
    ###
    return

  __interface__

