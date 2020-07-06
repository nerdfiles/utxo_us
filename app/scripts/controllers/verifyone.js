'use strict';

/**
 * @ngdoc function
 * @name utxoPmc.controller:VerifyoneCtrl
 * @description
 * # VerifyoneCtrl
 * Controller of the utxoPmc
 */
function VerifyoneCtrl ($scope, person, $location, map, authentication, segmentio) {
  $scope.person = {};
  $scope.person.inputAddress = {};

  $scope._id = null;

  authentication.loadSession().then(function () {
    console.log('Loaded person.');

    if (person && person.current && person.current.data && person.current.data.data) {
      $scope._id = person.current.data.data.name;
    }

    if (person && person.current) {
      $scope._id = person.current.$id;
      $scope.person = person.current;
      $scope.person.inputAddress = {};
    }

  });

  $scope.updatePerson = function (_person) {

    var _property = 'overview';
    $scope._id = _person.$id;

    try {
      if (person.current && person.current.data && person.current.data.data.name) {
        $scope._id = person.current.data.data.name;
      }
    } catch (e) {
      console.log('Loading existing user.');
    }

    if (person.current && person.current.overview && person.current.overview.terms == 'true') {
      _person[_property].terms = 'true';
    }

    var strategy = {
      handle   : $scope._id,
      property : _property,
      payload  : _person[_property]
    };

    person.write(strategy).then(function (_personData) {
      var personData = _personData.data.data;
      var _full_name = personData.full_name.split(' ');
      var name_first, name_middle, name_last;
      var birth_day, birth_month, birth_year;
      var document_type = 'ssn';
      var document_value = personData.ssn;
      var street1 = $scope.person.inputAddress.street1;
      var city = $scope.person.inputAddress.city;
      var state = $scope.person.inputAddress.state;
      var zipCode = $scope.person.inputAddress.zipCode;
      var sep = ' ';
      personData.primary_address = [
        street1,
        city,
        state,
        zipCode
      ].join(sep);

      try {
        analytics.track('Passed Verification', {
          location: 'form',
          type: 'ng-submit'
        });
      } catch (e) {
        console.dir(e);
      }

      // Formatting
      if (_.size(_full_name) === 3) {
        name_first = _full_name[0];
        name_middle = _full_name[1];
        name_last = _full_name[2];
      } else if (_.size(_full_name) === 2) {
        name_first = _full_name[0];
        name_last = _full_name[1];
      } else {
        alert('Please provide a full name!');
        return;
      }

      var d, dayDate, monthDate, yearDate;

      try {

        d = new Date(personData.birthdate);

        dayDate = d.getDate();
        monthDate = d.getMonth() + 1;
        yearDate = d.getFullYear();

      } catch (e) {
        console.log('Not a valid birthdate.');
      }

      map.Owlish.verifyAddress(personData.primary_address).then(function (_verifiedAddress) {
        var formObject = {};
        var verifiedAddress = _verifiedAddress.data.results[0].address_components;
        formObject.name_first = name_first;
        formObject.name_middle = name_middle || null;
        formObject.name_last = name_last;
        formObject.birth_day = dayDate;
        formObject.birth_month = monthDate;
        formObject.birth_year = yearDate;
        formObject.document_type = document_type;
        formObject.document_value = document_value;
        formObject.address_street1 = verifiedAddress[0].long_name + ' ' + verifiedAddress[1].long_name;
        var street2 = (personData.primary_address.split('Apt').length === 1) ? personData.primary_address.split('Ste') : personData.primary_address.split('Apt');
        var s2 = $.trim(street2[1]);
        formObject.address_street2 = s2 || null;
        formObject.address_city = verifiedAddress[2].types[0] === 'neighborhood' ? verifiedAddress[3].long_name : verifiedAddress[2].long_name;
        formObject.address_subdivision = verifiedAddress[2].types[0] === 'neighborhood' ? verifiedAddress[5].long_name : verifiedAddress[4].long_name;
        formObject.address_postal_code = verifiedAddress[2].types[0] === 'neighborhood' ? verifiedAddress[7].long_name : verifiedAddress[6].long_name;
        formObject.address_country_code = verifiedAddress[2].types[0] === 'neighborhood' ? verifiedAddress[6].short_name : verifiedAddress[5].short_name;

        authentication.validate_identity(formObject).then(function (newIdentity) {
          person.current.verification = {};

          person.current.verification.id = newIdentity.data.id;
          person.current.verification.created_at = newIdentity.data.created_at;
          person.current.verification.updated_at = newIdentity.data.updated_at;

          person.current.verification.object = newIdentity.data.object;
          person.current.verification.note = newIdentity.data.note;
          person.current.verification.status = newIdentity.data.status;
          person.current.verification.livemode = newIdentity.data.livemode;
          person.current.verification.details__address = newIdentity.data.details.address;
          person.current.verification.details__address_risk = newIdentity.data.details.address_risk;
          person.current.verification.details__identification = newIdentity.data.details.identification;
          person.current.verification.details__date_of_birth = newIdentity.data.details.date_of_birth;
          person.current.verification.details__ofac = newIdentity.data.details.ofac;
          person.current.verification.details__pep = newIdentity.data.details.pep;

          person.current.verification.address_city = newIdentity.data.address_city;
          person.current.verification.address_country_code = newIdentity.data.address_country_code;
          person.current.verification.address_postal_code = newIdentity.data.address_postal_code;
          person.current.verification.address_street1 = newIdentity.data.address_street1;
          person.current.verification.address_street2 = newIdentity.data.address_street2;
          person.current.verification.address_subdivision = newIdentity.data.address_subdivision;

          var formObject = {
            person_id: person.current.verification.id
          };
          authentication.create_validate_questions(formObject).then(function (newAnswers) {
            person.current.question_set = newAnswers.data;

            /*
             *if ((person.current.verification.details__address == 'no_match' ||
             *  person.current.verification.details__address_risk == 'high' ||
             *  person.current.verification.details__identification == 'no_match' ||
             *  person.current.verification.details__date_of_birth == 'no_match' ||
             *  person.current.verification.details__ofac == 'match' ||
             *  person.current.verification.details__pep == 'match') && (person.current.verification.livemode == true || person.current.verification.livemode == 'true')) {
             */
            if (person.current.verification.status != 'valid' || person.current.verification.livemode == false) {
              /* PEP: Politically Exposed Person
              * OFAC: TERRORIST, MONEY LAUNDERER, OR CHILD MOLESTER (DO NOT MAKE SALE)
              */
              person.current.suspect = true;
              $location.path('/error');
              return;
            }

            $location.path('/verifyTwo');
          }, function (errorData) {
            person.current.unavailable = true;
            $location.path('/error');
          });
        });
      });

    }, function (errorData) {
      $location.path('/error');
      console.log(errorData);
    });

  };
}

angular.module('utxoPmc')
  .controller('VerifyoneCtrl', [
    '$scope',
    'person',
    '$location',
    'map',
    'authentication',
    VerifyoneCtrl
  ]);
