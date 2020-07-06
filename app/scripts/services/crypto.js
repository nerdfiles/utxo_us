'use strict';

/**
 * @ngdoc service
 * @name utxoPmc.crypto
 * @description
 * # crypto
 * Service in the utxoPmc.
 */
angular.module('utxoPmc')
  .service('crypto', function () {

    var serviceInterface;

    serviceInterface = {};

    serviceInterface.hash = function(str) {
      /**
      Hash a string using the default cipher.

      @param {string} str String to be hashed
      @return {string} Hashed string.
        */
      return this.hashWithSha1(str);
    };

    serviceInterface.md5 = function(str) {
      if (typeof str !== "string") {
        return "";
      }
      return CryptoJS.MD5(str).toString();
    };

    serviceInterface.hashWithSha1 = function(str) {
      /*
      Hash a string using the SHA1 cipher.

      @param {string} str String to be hashed
      @return {string} Hashed string.
        */
      if (typeof str !== "string") {
        return "";
      }
      return CryptoJS.SHA1(str).toString();
    };

    serviceInterface.encryptAES = function(msg, pass) {

      /*
      Encrypt a string using Advanced Encryption Standard. Combine with
      Authentication Scheme: http://www.cryptopp.com/wiki/Authenticated_Encryption

      @param {string} msg Message to be encrypted, likely a token.
      @return {string} pass Passphrase.
        */
      var encrypted;
      return encrypted = CryptoJS.AES.encrypt(msg, pass);
    };

    serviceInterface.decryptAES = function(enc, pass) {

      /*
      Decrypt a string using Advanced Encryption Algorithm.

      @param {string} enc Encrypted string.
      @return {string} pass Passphrase.
        */
      var decrypted;
      return decrypted = CryptoJS.AES.decrypt(enc, pass);
    };

    serviceInterface.encrypt = serviceInterface.encryptAES;
    serviceInterface.decrypt = serviceInterface.decryptAES;

    return serviceInterface;

  });
