let voterInterface = {
  hasVoted: false,
  voteIndex: -1,
  weight: 0
}

app.service('vote', function ($q) {
    var voteContract,
        voteContractAddress = "0x54931B7e9e97DC9530e6cb1aD7780f76C4c71bFB",
        userAccount;

    this.smartContract = function () {
        var deferred = $q.defer();

        web3.eth.defaultAccount = web3.eth.accounts[0]; // set account
        voteContract = new web3.eth.Contract(voteAbi, voteContractAddress);

        web3.eth.getAccounts()
            .then(function (e) {
                userAccount = e;
                deferred.resolve(true);
            });

        return deferred.promise;
    };

    this.clearVote = function() {
      return voteContract.methods.clearVote().send({from: userAccount[0]})
    }

    this.getActualAccount = function() {
      return userAccount;
    }

    this.owner = function() {
      return voteContract.methods.owner().call();
    }

    this.winner = function() {
      return voteContract.methods.winner().call();
    }
    
    this.isOver = function() {
      return voteContract.methods.isOver().call();
    }

    this.register = function() {
      return voteContract.methods.register().send({from: userAccount[0]});
    }

    this.voters = function() {
      return voteContract.methods.voters(userAccount[0]).call();
    }

    this.name = function() {
      return voteContract.methods.name().call();
    }

    this.startElection = function() {
      return voteContract.methods.startElection().send({from: userAccount[0]});
    }

    this.endRound = function() {
      return voteContract.methods.end().send({from: userAccount[0]});
    }

    this.vote = function(id) {
      return voteContract.methods.vote(id).send({from: userAccount[0]});
    }

    this.addCandidate = function(name) {
      return voteContract.methods.addCandidate(name).send({from: userAccount[0]})
    }

    this.getCandidates = function() {
      return voteContract.methods.getCandidates().call();
    }

    this.getCandidateById = function(id) {
      return voteContract.methods.candidates(id).call();
    }

    this.getBracket = function() {
      return voteContract.methods.getBracket().call();
    }

    this.getBracketCandidateById = function(id) {
      return voteContract.methods.bracket(id).call().then((c) => { return c; })
    }
});
