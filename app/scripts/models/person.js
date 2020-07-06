angular.module('utxoPmc')
  .factory('person', function ($http, $timeout, $location) {
    var User = Gisele.Model.create({
      id     : { type  : Number, readOnly : true },
      name   : String,
      email  : String,
      active : { type  : Boolean, default : false }
    });

    var anon = new User({
        id           : 1,
        name         : 'Unauthenticated Anonymous User',
        email        : 'anon@email.com',
        website      : 'https://domain.com',
        websiteAlias : 'domain.com',
        colleague    : [
          1,
          2
        ]
    });

    return anon;
  });
