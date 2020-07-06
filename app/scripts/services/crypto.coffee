"use strict"

###*
@ngdoc service
@name utxoPmc.crypto
@description
# crypto
Service in the utxoPmc.
###
angular.module("utxoPmc").service "crypto", ->
  serviceInterface = undefined
  serviceInterface = {}
  serviceInterface.hash = (str) ->
    
    ###*
    Hash a string using the default cipher.
    
    @param {string} str String to be hashed
    @return {string} Hashed string.
    ###
    @hashWithSha1 str

  serviceInterface.md5 = (str) ->
    return ""  if typeof str isnt "string"
    CryptoJS.MD5(str).toString()

  serviceInterface.hashWithSha1 = (str) ->
    
    #
    #      Hash a string using the SHA1 cipher.
    #
    #      @param {string} str String to be hashed
    #      @return {string} Hashed string.
    #        
    return ""  if typeof str isnt "string"
    CryptoJS.SHA1(str).toString()

  serviceInterface.encryptAES = (msg, pass) ->
    
    #
    #      Encrypt a string using Advanced Encryption Standard. Combine with
    #      Authentication Scheme: http://www.cryptopp.com/wiki/Authenticated_Encryption
    #
    #      @param {string} msg Message to be encrypted, likely a token.
    #      @return {string} pass Passphrase.
    #        
    encrypted = undefined
    encrypted = CryptoJS.AES.encrypt(msg, pass)

  serviceInterface.decryptAES = (enc, pass) ->
    
    #
    #      Decrypt a string using Advanced Encryption Algorithm.
    #
    #      @param {string} enc Encrypted string.
    #      @return {string} pass Passphrase.
    #        
    decrypted = undefined
    decrypted = CryptoJS.AES.decrypt(enc, pass)

  serviceInterface.encrypt = serviceInterface.encryptAES
  serviceInterface.decrypt = serviceInterface.decryptAES
  serviceInterface

