'use strict';
app
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/winner', {
      templateUrl: 'winner/winner.html',
      controller: 'winnerCtrl'
    });
  }])
  .controller('winnerCtrl', ['$scope', 'vote', function($scope, vote) {
    $scope.winner = ""
    $scope.isAdmin = false;
    
    
    window.addEventListener('load', function()  {
      vote.smartContract()
      .then(_ => {
        return winner()
      })
      .then((w) => {
        $scope.winner = w;
      })

      web3.eth.getAccounts()
      .then(acc => {
        // isAdmin(acc[0])
        vote.clearVote()
      })
    })

    // function isAdmin(account) {
    //   vote.smartContract()
    //     .then(_ => {
    //       return vote.owner()
    //     })
    //     .then((acc) => {
    //       $scope.isAdmin = account.toLowerCase() === acc.toLowerCase() ? true : false;
    //       if($scope.isAdmin) {
            
    //       }
    //     })
    // }

    $scope.setWinner = function() {
      vote.smartContract()
      .then(_ => {
        return vote.winner()
      })
      .then((w) => {
        $scope.winner = w['name']
      })
    }
    $scope.setWinner()
  }]);