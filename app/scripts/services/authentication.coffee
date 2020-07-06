"use strict"

###*
@ngdoc service
@name utxoPmc.authentication
@description
# authentication
Service in the utxoPmc.
###
angular.module("utxoPmc").factory "authentication", ($timeout, $q, $http, $window, person, crypto, localStorageService, $location) ->
  
  ###*
  Authentication Service Interface.
  ###
  __interface__ = {}
  __interface__.loadSession = ->
    
    #
    #       *
    #       *
    #       
    def = $q.defer()
    sec_phone = localStorageService.get("hook")
    try
      _sec_phone = crypto.decrypt(sec_phone, person.session.user.token)
    catch e
      $location.path "/"
    exploded_sec_phone = _sec_phone.toString(CryptoJS.enc.Utf8)
    if person.session.user and exploded_sec_phone
      _formObject = phone_number: null
      _formObject.phone_number = exploded_sec_phone
      
      #var payload = $.param(_formObject);
      person.get(
        mode: "byId"
        handle: _formObject.phone_number
      ).then (personData) ->
        personData = (if personData? then personData else {})
        stored_order = (if (person.current and person.current.order) then person.current.order else null)
        if (personData and person.current and not person.current.order?) or person.current.order.paid is "true"
          person.current = personData
          _orders = _.toArray(personData.orders)
          _orders.sort (a, b) ->
            b.timestamp - a.timestamp

          person.current.order = _.last(_orders)
          person.current.order = stored_order  if stored_order
          def.resolve person.current
        else
          def.resolve person.current
        return

    
    #
    #        *$http.post(
    #        *  environment.rest.orders.latest,
    #        *  payload
    #        *).success(function (responseData) {
    #        *  console.dir(responseData);
    #        *}).error(function (errorData) {
    #        *  console.dir(errorData);
    #        *});
    #        
    else
      def.reject false
    def.promise

  uiCleanupStyles = {}
  portSpec = (if $window.location.port isnt "" then (":" + $window.location.port) else "")
  hostname = $window.location.hostname + portSpec
  uiCleanupStyles.property_clean = (type, obj) ->
    
    ###*
    Property Clean
    @inner
    ###
    switch type
      when "sanitize"
        _.forEach obj, (_property) ->
          p = _property.replace(/-/g, "")
          console.log p
          p

    obj

  __interface__.scrapeUrl = $window.location.protocol + "//" + hostname + "/scraper/"
  __interface__.validate_identity = (formObject) ->
    
    ###*
    Create Person
    
    @extends http://schema.org/Person
    @extends http://docs.blockscore.com/v4.0/python/#people
    @extends https://www.dandb.com/advanced-search/#people (CommonREST)
    @extends http://schema.org/Organziation
    @extends http://docs.blockscore.com/v4.0/python/#companies
    @extends https://www.dandb.com/advanced-search/#companies (CommonREST)
    ###
    baseUrl = environment.rest.person.create
    def = $q.defer()
    uri_base = "/"
    formObject["has_pos"] = null
    formObject["duns"] = null
    formObject["isic_v4"] = null
    formObject["naics"] = null
    formObject["tax_id"] = null
    formObject["vat_id"] = null
    formObject["email"] = null
    formObject["affiliation"] = null
    formObject["telephone"] = null
    formObject["uri"] = uri_base
    formObject["sales_opportunity"] = null
    formObject["latest_fin_sales"] = null
    formObject["industry"] = null
    formObject["primary_industry"] = null
    formObject["num_of_employees"] = 1
    formObject["seeks"] = null
    formObject["net_worth"] = null
    formObject["owns"] = null
    formObject["makes_offer"] = null
    formObject["member_off"] = null
    formObject["knows"] = null
    formObject["global_location_number"] = null
    formObject["fax_number"] = null
    formObject["under_name"] = null
    formObject["reviewed_by"] = null
    formObject["broker"] = null
    formObject["alumni_of"] = null
    payload = $.param(formObject)
    
    # @example {"data":{"phone_number":null,"name_first":"Aha","address_street1":"2800 San Jacinto Street","livemode":false,"updated_at":1441627226,"question_sets":[],"document_value":"5734","birth_day":27,"id":"55ed7c5a3735380003000158","note":null,"address_subdivision":"Texas","name_middle":"","details":{"ofac":"no_match","address_risk":"low","pep":"no_match","date_of_birth":"not_found","identification":"no_match","address":"no_match"},"birth_month":3,"birth_year":1985,"status":"invalid","address_street2":"","object":"person","document_type":"ssn","ip_address":"","address_country_code":"US","address_city":"Houston","name_last":"Hah","created_at":1441627226,"address_postal_code":"77004"}}
    $http.post(baseUrl, payload).success((responseData) ->
      def.resolve responseData
      return
    ).error (errorData) ->
      def.reject errorData
      return

    def.promise

  __interface__.score_question_set = (formObject) ->
    
    ###*
    Score Validation Question Set
    ###
    baseUrl = environment.rest.questionSet.validate
    def = $q.defer()
    payload = $.param(formObject)
    $http.post(baseUrl + "/" + formObject.id, payload).success((responseData) ->
      def.resolve responseData
      return
    ).error (errorData) ->
      def.reject errorData
      return

    def.promise

  __interface__.create_validate_questions = (formObject) ->
    
    ###*
    Create Validation Questions Set
    ###
    baseUrl = environment.rest.questionSet.create
    def = $q.defer()
    payload = $.param(person_id: formObject.person_id)
    $http.post(baseUrl, payload).success((responseData) ->
      def.resolve responseData
      return
    ).error (errorData) ->
      def.reject errorData
      return

    def.promise

  __interface__.validate_phone_number = (formObject) ->
    
    ###*
    Validate Phone Number
    ###
    baseUrl = environment.rest.authenticationSms.create
    def = $q.defer()
    _formObject = uiCleanupStyles.property_clean("sanitize", formObject)
    payload = $.param(_formObject)
    $http.post(baseUrl, payload).success((responseData) ->
      def.resolve responseData
      return
    ).error (errorData) ->
      def.reject errorData
      return

    def.promise

  
  ###*
  Export Authentication Service Interface.
  ###
  __interface__

