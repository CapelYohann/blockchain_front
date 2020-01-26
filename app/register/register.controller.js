'use strict';
app
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
      templateUrl: 'register/register.html',
      controller: 'registerCtrl'
    });
  }])
  .controller('registerCtrl', ['$scope', '$location', 'vote', function($scope, $location, vote) {

    $scope.register = function() {
      vote.smartContract()
        .then(_ => {
          return vote.register();
        })
        .then(_=> {
          console.log("register done")
          $location.path("/vote")
        })
    }
  }]);
