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

/* factory for a single card */
starter.factory('Card', function(){
  return function(_suit, _number) {
    var suit = "";
    var number = 0;
    var color = "";
    var rank = "0";
    var used = false;
    var image = "";

    /* constructor */
    function init() {
        suit = _suit;
        if(_suit == "spades" || _suit == "clubs")
          color = "black";
        else
          color = "red";
        number = _number;

        /* get the rank as a string */
        if(number > 1 && number < 11)
          rank = number.toString();
        else if(number == 1)
          rank = "ace";
        else if(number == 11)
          rank = "jack";
        else if(number == 12)
          rank = "queen";
        else if(number == 13)
          rank = "king";
        else
          rank = "back";

        used = false;

        /* get the image file */
        if(rank == "back")
          image = "PNG-cards-1.3/card_back.png";
        else
          image = "PNG-cards-1.3/" + rank + "_of_" + suit + ".png";
    }

    /* call constructor */
    init();

    /* accessible variables */
    return {
      suit: suit,
      number: number,
      color: color,
      rank: rank,
      used: used,
      image: image
    };
  };
});

/* factory for a card deck */
starter.factory('CardDeck', function(Card){
  return function() {
    /* array to store cards */
    var cards = [];
    /* array of suit names */
    var suits = ["spades", "clubs", "hearts", "diamonds"];

    /* create cards and store in cards array */
    function fillDeck() {
      var index = 0;
      for(var s = 0; s < suits.length; s++) {
          for(var i = 0; i < 13; i++) {
          var suit = suits[s];
          cards[index] = new Card(suit, i+1);
          index++;
        }
      }
    }

    /* get the next card, returns null if empty */
    function getTopCard() {
      /* Note: pulls card from back of deck */
      for(var i = 0; i < 52; i++) {
        if(cards[i].used == false) {
          cards[i].used = true;
          return cards[i];
        }
      }
      return null;
    }

    /* shuffle the deck */
    function shuffleDeck() {
      for(var i = 0; i < 1000; i++){
        var numOne = Math.floor(Math.random() * 52);
        var numTwo = Math.floor(Math.random() * 52);
        var temp = cards[numOne];
        cards[numOne] = cards[numTwo];
        cards[numTwo] = temp;
      }
    }

    /* fill and shuffle once the deck is created */
    fillDeck();
    shuffleDeck();

    /* accessible functions */
    return {
      getTopCard: getTopCard
    }
  };
});

/* factory for a player */
starter.factory('Player', function() {
  return function(_name) {
    /* array to store players cards */
    var name = "";
    var cards = [];
    var drinksTaken = 0;
    var drinksGiven = 0;

    /* constructor */
    function init() {
      name = _name;
      cards = [];
      drinksTaken = 0;
      drinksGiven = 0;
    }

    /* call constructor */
    init();

    /* increment drinks taken */
    function takeADrink() {
      drinksTaken++;
    }

    /* increment drinks given and give a drink to another player */
    function giveADrink(player) {
      drinksGiven++;
      player.takeADrink();
    }

    /* add card */
    function addCard(card) {
      cards.add(card);
    }

    /* accessible functions */
    return {
      takeADrink: takeADrink,
      giveADrink: giveADrink,
      addCard: addCard
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
    $state.go("players");
  }
});

starter.controller('playersCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading) {
  /* back to home page */
  $scope.toHome = function() {
    $state.go("index");
  };

  /* start RTB, store player names */
  $scope.toTheBus = function() {
    /* store player names */
    $rootScope.playerNames = [];
    for(var i = 0; i < 1; i++)
      $rootScope.playerNames[i] = $scope.answer_one;

    $state.go("rideTheBus");
  };
});

starter.controller('rideTheBusCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck, Player){
  $scope.toHome = function() {
    $state.go("index");
  };

  /* create a player for each user input */
  $rootScope.players = [];
  for(var i = 0; i < 1; i++)
    $rootScope.players[i] = new Player($rootScope.playerNames[i]);

  /* create a new deck */
  $scope.deck = new CardDeck();

  /* create a new back of card */
  $scope.cardBack = new Card("", 0);
  $scope.nextCard = $scope.cardBack;

  /* get the next card from the deck */
  $scope.getCard = function() {
    $scope.nextCard = $scope.deck.getTopCard();
    if($scope.nextCard == null)
      $scope.nextCard = $scope.cardBack;
  }

  /* first card, red or black */
  $scope.guessColor = function() {
    /* get the next card */
    $scope.getCard();

    /* check if the guess is correct */
    if($scope.guessedColor == $scope.nextCard.color) {
      $scope.currentPlayer.giveADrink();
    }
    else {
      $scope.currentPlayer.takeADrink();
    }

    /* add card to players hand */
    $scope.currentPlayer.addCard($scope.nextCard);
  }

  /* second card, higher or lower */
  $scope.guessHigherOrLower = function() {

  }

  /* third card, inside or outside */
  $scope.guessInsideOrOutside = function() {

  }

  /* fourth card, suit */
  $scope.guessSuit = function() {

  }
});
