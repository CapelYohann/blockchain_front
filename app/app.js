'use strict';

// Declare app level module which depends on views, and core components
let app = angular.module('myApp', [
  'ngRoute',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider, ) {
  window.addEventListener('load', function() {
      if (typeof web3 !== 'undefined') {
        console.log("metamask")
        web3 = new Web3(web3.currentProvider);
      } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      }
    })
    $routeProvider.otherwise({redirectTo: '/register'});
}]);
