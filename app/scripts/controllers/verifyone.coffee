
###*
@ngdoc function
@name utxoPmc.controller:VerifyoneCtrl
@description
# VerifyoneCtrl
Controller of the utxoPmc
###
VerifyoneCtrl = ($scope, person, $location, map, authentication) ->
  $scope.person = {}
  _id = null
  _id = person.current.$id  if person and person.current and person.current.overview and person.current.overview.terms is "true"
  $scope.updatePerson = (_person) ->
    _property = "overview"
    try
      _id = person.current.data.data.name  if person.current.data.data.name
    catch e
      console.log "Loading existing user."
    _person[_property].terms = "true"  if person.current.overview.terms is "true"
    strategy =
      handle: _id
      property: _property
      payload: _person[_property]

    person.write(strategy).then ((_personData) ->
      personData = _personData.data.data
      _full_name = personData.full_name.split(" ")
      name_first = undefined
      name_middle = undefined
      name_last = undefined
      birth_day = undefined
      birth_month = undefined
      birth_year = undefined
      document_type = "ssn"
      document_value = personData.ssn
      
      # Formatting
      if _.size(_full_name) is 3
        name_first = _full_name[0]
        name_middle = _full_name[1]
        name_last = _full_name[2]
      else if _.size(_full_name) is 2
        name_first = _full_name[0]
        name_last = _full_name[1]
      else
        alert "Please provide a full name!"
        return
      d = undefined
      dayDate = undefined
      monthDate = undefined
      yearDate = undefined
      try
        d = new Date(personData.birthdate)
        dayDate = d.getDate()
        monthDate = d.getMonth() + 1
        yearDate = d.getFullYear()
      catch e
        console.log "Not a valid birthdate."
      map.Owlish.verifyAddress(personData.primary_address).then (_verifiedAddress) ->
        formObject = {}
        verifiedAddress = _verifiedAddress.data.results[0].address_components
        formObject.name_first = name_first
        formObject.name_middle = name_middle or null
        formObject.name_last = name_last
        formObject.birth_day = dayDate
        formObject.birth_month = monthDate
        formObject.birth_year = yearDate
        formObject.document_type = document_type
        formObject.document_value = document_value
        formObject.address_street1 = verifiedAddress[0].long_name + " " + verifiedAddress[1].long_name
        street2 = (if (personData.primary_address.split("Apt").length is 1) then personData.primary_address.split("Ste") else personData.primary_address.split("Apt"))
        s2 = $.trim(street2[1])
        formObject.address_street2 = s2 or null
        formObject.address_city = verifiedAddress[3].long_name
        formObject.address_subdivision = verifiedAddress[5].long_name
        formObject.address_postal_code = verifiedAddress[7].long_name
        formObject.address_country_code = verifiedAddress[6].short_name
        authentication.validate_identity(formObject).then (newIdentity) ->
          person.current.verification = {}
          person.current.verification.id = newIdentity.data.id
          person.current.verification.created_at = newIdentity.data.created_at
          person.current.verification.updated_at = newIdentity.data.updated_at
          person.current.verification.object = newIdentity.data.object
          person.current.verification.note = newIdentity.data.note
          person.current.verification.status = newIdentity.data.status
          person.current.verification.livemode = newIdentity.data.livemode
          person.current.verification.details__address = newIdentity.data.details.address
          person.current.verification.details__address_risk = newIdentity.data.details.address_risk
          person.current.verification.details__identification = newIdentity.data.details.identification
          person.current.verification.details__date_of_birth = newIdentity.data.details.date_of_birth
          person.current.verification.details__ofac = newIdentity.data.details.ofac
          person.current.verification.details__pep = newIdentity.data.details.pep
          person.current.verification.address_city = newIdentity.data.address_city
          person.current.verification.address_country_code = newIdentity.data.address_country_code
          person.current.verification.address_postal_code = newIdentity.data.address_postal_code
          person.current.verification.address_street1 = newIdentity.data.address_street1
          person.current.verification.address_street2 = newIdentity.data.address_street2
          person.current.verification.address_subdivision = newIdentity.data.address_subdivision
          formObject = person_id: person.current.verification.id
          authentication.create_validate_questions(formObject).then ((newAnswers) ->
            person.current.question_set = newAnswers.data
            if (person.current.verification.details__address is "no_match" or person.current.verification.details__address_risk is "high" or person.current.verification.details__identification is "no_match" or person.current.verification.details__date_of_birth is "no_match" or person.current.verification.details__ofac is "match" or person.current.verification.details__pep is "match") and (person.current.verification.livemode is true or person.current.verification.livemode is "true")
              
              # PEP: Politically Exposed Person
              #              * OFAC: TERRORIST, MONEY LAUNDERER, OR CHILD MOLESTER (DO NOT MAKE SALE)
              #              
              person.current.suspect = true
              $location.path "/error"
              return
            $location.path "/verifyTwo"
            return
          ), (errorData) ->
            person.current.unavailable = true
            $location.path "/error"
            return

          return

        return

      return
    ), (errorData) ->
      $location.path "/error"
      console.log errorData
      return

    return

  return
"use strict"
angular.module("utxoPmc").controller "VerifyoneCtrl", [
  "$scope"
  "person"
  "$location"
  "map"
  "authentication"
  VerifyoneCtrl
]
