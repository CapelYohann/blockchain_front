'use strict';
app
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/vote', {
      templateUrl: 'vote/vote.html',
      controller: 'voteCtrl'
    });
  }])
  .controller('voteCtrl', ['$scope', '$location', 'vote', function($scope, $location, vote) {
    $scope.electionHasStarted = false;
    $scope.bracket = [];
    $scope.loser = [];
    $scope.eliminated = []
    $scope.bracketName = "No name";
    $scope.isAdmin = false;
    $scope.candidateName = ""

    window.ethereum.on('accountsChanged', function (accounts) {
      isAdmin(accounts[0])
    })

    window.addEventListener('load', () => {
      web3.eth.getAccounts()
      .then(acc => {
        isAdmin(acc[0])
      })

      vote.smartContract()
      .then(_ => {
        return vote.getBracket()
      })
      .then((b) => {
        generateBracket(b)
      })
      .then(_ => {
        return vote.getCandidates();
      })
      .then((c) => {
        generateOthers(c);
      })
      .then(_ => {
        return vote.name();
      })
      .then((name)  => {
        $scope.bracketName = name
      })
    })

    function isAdmin(account) {
      vote.smartContract()
        .then(_ => {
          return vote.owner()
        })
        .then((acc) => {
          $scope.isAdmin = account.toLowerCase() === acc.toLowerCase() ? true : false;
        })
    }

    $scope.startElection = function() {
      vote.smartContract()
        .then(_ => {
          return vote.startElection()
        })
        .then(_ => {
          return vote.getBracket()
        })
        .then((b) => {
          generateBracket(b)
        })
        .then(_ => {
          return vote.name();
        })
        .then((name)  => {
          $scope.bracketName = name
        })
    }

    function generateBracket(b) {
      $scope.bracket = []
      for(var i = 0; i < b.length; i++) {
        $scope.bracket.push({"name": b[i]['name'], "voteCount": b[i]['voteCount'], "isLoser": b[i]['isLoser'], "isEliminated": b[i]['isEliminated']})
      }
      $scope.electionHasStarted = true;
    }

    function generateOthers(b) {
      $scope.loser = []
      $scope.eliminated = []
      for(var i = 0; i < b.length; i++) {
        let a = {"name": b[i]['name'], "voteCount": b[i]['voteCount'], "isLoser": b[i]['isLoser'], "isEliminated": b[i]['isEliminated']}
        
        if(a['isEliminated'] === true) {
          $scope.eliminated.push(a)
        } else if(a['isLoser'] === true) {
          $scope.loser.push(a)
        }
      }
    }

    $scope.endRound = function() {
      vote.smartContract()
        .then(_ => {
          return vote.endRound()
        })
        .then(_ => {
          console.log("round ended")
          return vote.isOver();
        })
        .then(isOver => {
          if(!isOver) {
            window.location.reload()
            // console.log("!isOver")
            // vote.getBracket()
            //   .then((b) => {
            //     console.log("bracket")
            //     console.log(b)
            //     generateBracket(b)
            //   })
            //   .then(_ => {
            //     return vote.getCandidates();
            //   })
            //   .then((c) => {
            //     console.log("candidates")
            //     console.log(c)
            //     generateOthers(c);
            //   })
            //   .then(_ => {
            //     return vote.name();
            //   })
            //   .then((name)  => {
            //     console.log("name = " + name)
            //     $scope.bracketName = name
            //   })
          } else {
            $location.path("/winner")
          }
        })
    }

    $scope.getBracket = function() {
      vote.smartContract()
        .then(_ => {
          return vote.getBracket();
        })
        .then((b) => {
          generateBracket(b)
          console.log($scope.bracket)
        })
    }

    $scope.name = function() {
      vote.smartContract()
      .then(_ => {
        return vote.name();
        })
        .then((name)  => {
          console.log(name)
          $scope.bracketName = name
        })
    }
    
    $scope.vote = function(id) {
      vote.smartContract()
        .then(_ => {
          return vote.vote(id);
        })
        .then((res) => {
          console.log('Voted for : ' + $scope.bracket[id]['name'])
        })
    }

    $scope.inputChange = function(input) {
      $scope.candidateName = input.candidateName
    }
    $scope.addCandidate = function(){
      if($scope.candidateName !== "" || $scope.candidateName !== undefined) {
        vote.smartContract()
          .then(_ => {
            return vote.addCandidate($scope.candidateName)
          })
          .then((c) => {
            console.log("Candidate added !")
          })
      }
    }

    $scope.getCandidates = function() {
      vote.smartContract()
        .then(_ => {
          return vote.getCandidates();
        })
        .then((c) => {
          generateOthers(c)
          console.log($scope.loser)
        })
    }

    $scope.register = function() {
      vote.smartContract()
        .then(_ => {
          return vote.register();
        })
        .then(_=> {
          console.log("register done")
        })
    }

    $scope.voters = function() {
      vote.smartContract()
        .then(_ => {
          return vote.voters();
        })
        .then((e) => {
          console.log("vote");
          console.log(e)
        })
    }
  }
]);
