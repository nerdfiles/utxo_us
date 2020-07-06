'use strict';

/**
 * @ngdoc service
 * @name utxoPmc.map
 * @description
 * # map
 * Service in the utxoPmc.
 */
angular.module('utxoPmc')
  .service('map', function ($http) {
    var __service__ = {};

    __service__.Owlish = {};

    __service__.Owlish.verifyAddress = function(addressString) {
      /*
      Process address string and verify address against Google's Geocoding API.

      @param {string} addressString
      @namespace verifyAddress
      @return {Promise}
        */
      var a, address, baseAddressApi, combinedAddress, formattedAddress, key, prefix_address, prefix_key, urlApi, _address, _addressString, _tmpAddress;
      key = environment.google.maps.key;
      urlApi = environment.google.maps.geocode;
      prefix_address = 'address=';
      prefix_key = 'key=';
      _addressString = addressString.split('\n');
      formattedAddress = _addressString.join(' ');
      _tmpAddress = addressit(formattedAddress);
      _address = _.map(_tmpAddress, function(addressComponent, keyname) {
        if (keyname === 'text') {
          return addressComponent;
        }
      });
      address = _.last(_.filter(_address, function(addressAtom) {
        return addressAtom;
      }));
      a = address.replace(/\ /g, '+');
      combinedAddress = [prefix_address + a, prefix_key + key].join('&');
      baseAddressApi = [urlApi, combinedAddress].join('?');
      console.log(baseAddressApi);
      return $http.get(baseAddressApi, {
        headers: {'X-Requested-With': undefined}
      });
    };

    return __service__;

  });
