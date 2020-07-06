"use strict"

###*
@ngdoc service
@name utxoPmc.map
@description
# map
Service in the utxoPmc.
###
angular.module("utxoPmc").service "map", ($http) ->
  __service__ = {}
  __service__.Owlish = {}
  __service__.Owlish.verifyAddress = (addressString) ->
    
    #
    #      Process address string and verify address against Google's Geocoding API.
    #
    #      @param {string} addressString
    #      @namespace verifyAddress
    #      @return {Promise}
    #        
    a = undefined
    address = undefined
    baseAddressApi = undefined
    combinedAddress = undefined
    formattedAddress = undefined
    key = undefined
    prefix_address = undefined
    prefix_key = undefined
    urlApi = undefined
    _address = undefined
    _addressString = undefined
    _tmpAddress = undefined
    key = environment.google.maps.key
    urlApi = environment.google.maps.geocode
    prefix_address = "address="
    prefix_key = "key="
    _addressString = addressString.split("\n")
    formattedAddress = _addressString.join(" ")
    _tmpAddress = addressit(formattedAddress)
    _address = _.map(_tmpAddress, (addressComponent, keyname) ->
      addressComponent  if keyname is "text"
    )
    address = _.last(_.filter(_address, (addressAtom) ->
      addressAtom
    ))
    a = address.replace(/\ /g, "+")
    combinedAddress = [
      prefix_address + a
      prefix_key + key
    ].join("&")
    baseAddressApi = [
      urlApi
      combinedAddress
    ].join("?")
    console.log baseAddressApi
    $http.get baseAddressApi,
      headers:
        "X-Requested-With": `undefined`


  __service__

