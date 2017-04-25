// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var starter = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

starter.factory('Card', function(){
  return function() {
    self.suit = "spade";
    self.number = 1;
    self.color = "black";
    self.used = false;

    self.init = function(_suit, _number) {
        self.suit = _suit;
        if(_suit == "spade" || _suit == "club")
          self.color = "black";
        else
          self.color = "red";
        self.number = _number;
        self.used = false;
    }
    return self;
  }
});

starter.factory('CardDeck', function(Card){
  return function() {
    var deck = [];
    var suits = ["spade", "club", "heart", "diamond"];

    self.fillDeck = function() {
      var index = 0;
      for(var s = 0; s < suits.length; s++) {
          for(var i = 0; i < 13; i++) {
          var suit = suits[s];
          deck[index] = new Card();
          deck[index].init(suit, i+1);
          console.log(deck[index].suit, deck[index].number, deck[index].color, deck[index].used);
          index++;
        }
      }

      for(index = 0; index < deck.length; index++)
      console.log(deck[index].suit, deck[index].number, deck[index].color, deck[index].used);

      // create cards by by suit and number
      /*for (var s = 0; s < 4; s++) {
        suit = suits[s];
        if (suit == "spade" || suit == "club") {
          color = "black";
        } else {
          color = "red";
        }

        // count by card number
        for (var i = 0; i < 13; i++) {
          var index = s * 13 + i;
          deck[index] = new Card();
          deck[index].init(suit, i + 1, color);
        }
      } */
    };

    /*self.getTopCard = function() {
      //Note: pulls card from back of deck
      for(var i = 0; i < 52; i++){
        if(deck[i].used==false){
          deck[i].used = true;
          return deck[i];
        }
      }
      //if all the cards are used, reset used to false (multiple decks)
      for(var i = 0; i < 52; i++){
        deck[i].used = false;
      }
      // pull the back card
      deck[0].used = true;
      return deck[0];
    };

    self.shuffleDeck = function() {
      var numOne;
      var numTwo;

      for(var i = 0; i < 1000; i++){
        numOne = Math.floor(Math.random() * 52);
        numTwo = Math.floor(Math.random() * 52);
        var temp = deck[numOne];
        deck[numOne] = deck[numTwo];
        deck[numTwo] = temp;
      }
    }; */

    // fill and shuffle once the deck is created
    self.fillDeck();
    //self.shuffleDeck();

    return self;
  }
});

starter.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'home.html'
  })
   .state('players', {
     url: '/players',
     controller: 'playersCtrl',
     templateUrl: 'players.html'
   })
    .state('rideTheBus', {
      url: '/rideTheBus',
      controller: 'rideTheBusCtrl',
      templateUrl: 'rideTheBus.html'
    });
  $urlRouterProvider.otherwise('/');
});

starter.controller('MainCtrl', function($scope, $state, $ionicModal, $ionicLoading) {
  $scope.toPlayersState = function() {
    $state.go("players")
  }
});

starter.controller('playersCtrl', function($scope, $state, $ionicModal, $ionicLoading) {
$scope.toHome = function() {
  $state.go("index")
};
  $scope.toTheBus = function() {
    $state.go("rideTheBus")
  };
});

starter.controller('rideTheBusCtrl', function($scope, $state, $ionicModal, $ionicLoading, Card, CardDeck){
  $scope.toHome = function() {
    $state.go("index")
  };
  $scope.deck = new CardDeck();

  $scope.getCard = function(){
    $scope.exampleCard = $scope.deck.getTopCard();
  }
});


