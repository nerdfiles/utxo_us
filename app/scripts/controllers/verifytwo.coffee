"use strict"

###*
@ngdoc function
@name utxoPmc.controller:VerifytwoCtrl
@description
# VerifytwoCtrl
Controller of the utxoPmc
###
angular.module("utxoPmc").controller "VerifytwoCtrl", ($scope, person, $location, authentication) ->
  $scope.person = {}
  _id = null
  if person and person.current and person.current.verification and person.current.question_set
    _id = person.current.$id
    $scope.person = person.current
  
  ###*
  Test codes for question sets
  
  Answer            Question
  309 Colver Rd     Which one of the following addresses is associated with you?
  812               Which one of the following area codes is associated with you?
  Jasper            Which one of the following counties is associated with you?
  49230             Which one of the following zip codes is associated with you?
  None of the above What state was your SSN issued in?
  None of the above Which one of the following adult individuals is most closely associated with you?
  ###
  $scope.question_set = person.current.question_set
  $scope.question_set_answer_set = {}
  console.log $scope.question_set
  $scope.updatePerson = (_person) ->
    strategy =
      handle: _id
      property: "verification"
      payload: _person["verification"]

    person.write(strategy).then ((personData) ->
      formObject = $scope.question_set_answer_set
      formObject.id = $scope.question_set.id
      authentication.score_question_set(formObject).then ((questionSetResponse) ->
        if questionSetResponse.data and (parseFloat(questionSetResponse.data.score) > 60.0) or (questionSetResponse.data.livemode is false)
          person.current.question_set_score = questionSetResponse
          $location.path "/verifyThree"
        else
          person.current.questionable = true
          $location.path "/error"
        return
      ), (errorData) ->
        $location.path "/error"
        return

      return
    ), (errorData) ->
      $location.path "/error"
      return

    return

  return

