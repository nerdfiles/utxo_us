angular.module('firebase.config', [])
  .constant('FBURL', 'https://utxo.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','anonymous'])
  //.constant('loginRedirectPath', '/login');
  .constant('loginRedirectPath', '/');
