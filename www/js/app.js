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
    var face = null;
    var suit = "spade";
    var number = 2;
    var color = "black";

    function init(_face, _suit, _number, _color) {
      if (_face == null) {
        suit = _suit;
        number = _number;
        color = _color;
      } else {
        face = _face;
        suit = _suit;
        color = _color;
        number = _number;
      }
    }

    init();

    return {
      face: this.face,
      suit: this.suit,
      number: this.number,
      color: this.color
    }
  }
});

starter.factory('CardDeck', function(Card){
  return function() {
    var deck = new Array(52);
    var suits = ["spade", "club", "heart", "diamond"];

    function fillDeck() {
      var suit = null;
      var color = null;
      for (var s = 0; s < 4; s++) {
        suit = suits[s];
        if (suit == "spade" || suit == "club") {
          color = "black";
        } else {
          color = "red";
        }

        for (var i = 0; i < 13; i++) {
          var index = s * 13 + i;
          deck[index] = new Card(null, suit, i, color);
        }
      }
    }

    fillDeck();

    function getTopCard() {
      //Note: pulls card from back of deck
      return deck[deck.length];
    }

    //TODO: complete function
    function shuffleDeck() {

    }


    return {
      getTopCard: this.getTopCard,
      shuffleDeck: this.shuffleDeck
    }
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
  $scope.exampleCard = null;
  $scope.deck = new CardDeck();

  $scope.getCard = function(){
    $scope.exampleCard = $scope.deck.getTopCard();
  }

});


