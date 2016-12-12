import moment from 'moment';
PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {
  Template.leaderboard.helpers ({
    'player': function() {
      var currentUserId = Meteor.userId();
      return PlayersList.find({ createdBy: currentUserId }, { sort: { score: -1 , name: 1 } });
    },
    'selectedClass': function() {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer) {
        return "selected";
      }
    },
    'selectedPlayer': function() {
      var selectedPlayer = Session.get('selectedPayer');
      return PlayersList.findOne({ _id: selectedPayer }) + " lol";
    }
  });

  Template.leaderboard.events({
    'click .player': function() {
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
      var selectedPlayer = Session.get('selectedPlayer');
      console.log(selectedPlayer);
    },
    'click .increment': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('updateScore', selectedPlayer, 5);
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('updateScore', selectedPlayer, -5);
    },
    'click .remove': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('removePlayer', selectedPlayer);
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event) {
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      Meteor.call('createPlayer', playerNameVar);
      event.target.playerName.value = "";
    }
  });

  Meteor.subscribe('thePlayers');

}

if(Meteor.isServer) {
  Meteor.publish('thePlayers', function() {
    var currentUserId = this.userId;
    return PlayersList.find({ createdBy: currentUserId });
  });
}

Meteor.methods({
  'createPlayer': function(playerNameVar) {
    check(playerNameVar, String);
    var currentUserId = Meteor.userId();
    if(currentUserId) {
      PlayersList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId
      });
     console.log("You've called a method");
    } else {
      console.log("You're logged out");
    }
  },
  'removePlayer': function(selectedPlayer) {
    check(selectedPlayer, String);
    var currentUserId = Meteor.userId();
    if(currentUserId) {
      PlayersList.remove({ _id: selectedPlayer, createdBy: currentUserId });
    }
  },
  'updateScore': function(selectedPlayer, scoreValue) {
    check(selectedPlayer, String);
    check(scoreValue, Number);
    var currentUserId = Meteor.userId();
    if(currentUserId) {
      PlayersList.update({ _id: selectedPlayer, createdBy: currentUserId }, { $inc: { score: scoreValue } });
    }
  }
});
