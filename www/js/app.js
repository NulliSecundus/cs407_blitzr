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
      for(var i = 0; i < 10000; i++){
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

    /* get name */
    function getName() {
      return name;
    }

    /* increment drinks taken */
    function takeADrink() {
      drinksTaken++;
      document.getElementById("wrong").style.display = "";
      document.getElementById("takeADrink").style.display = "";
      setTimeout(resetDisplay, 3000);
    }

    /* increment drinks given and give a drink to another player */
    function giveADrink(player) {
      drinksGiven++;
      document.getElementById("correct").style.display = "";
      document.getElementById("giveADrink").style.display = "";
      setTimeout(resetDisplay, 3000);
      //player.takeADrink();
    }

    /* reset take and give display */
    function resetDisplay() {
      document.getElementById("wrong").style.display = "none";
      document.getElementById("takeADrink").style.display = "none";
      document.getElementById("correct").style.display = "none";
      document.getElementById("giveADrink").style.display = "none";
    }

    /* add card */
    function addCard(card) {
      cards.add(card);
    }

    /* accessible functions */
    return {
      getName: getName,
      takeADrink: takeADrink,
      giveADrink: giveADrink,
      addCard: addCard
    }
  }
});

/* factory for information about each round */
starter.factory('Round', function() {
  return function(_roundNumber) {
    var round = 0;
    var buttons = [];

    /* constructor */
    function init() {
      if(_roundNumber == 0) {
        buttons = ["play_button"];
        round = 0;
      }
      else if(_roundNumber == 1) {
        buttons = ["red_button", "black_button"];
        round = 1;
      }
      else if(_roundNumber == 2) {
        buttons = ["higher_button", "lower_button"];
        round = 2;
      }
      else if(_roundNumber == 3) {
        buttons = ["inside_button", "outside_button"];
        round = 3;
      }
      else if(_roundNumber == 4) {
        buttons = ["spades_button", "clubs_button", "hearts_button", "diamonds_button"];
        round = 4;
      }
      else {
      }
    }

    /* call constructor */
    init();

    /* accessible variables */
    return {
      buttons: buttons,
      round: round
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

starter.controller('rideTheBusCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player, Round){
  $scope.toHome = function() {
    $state.go("index");
  };

  /* create a player for each user input */
  $rootScope.players = [];
  for(var i = 0; i < 1; i++)
    $rootScope.players[i] = new Player($rootScope.playerNames[i]);

  /* create a new deck */
  $rootScope.deck = new CardDeck();

  /* create a new back of card */
  $scope.cardBack = new Card("", 0);
  $scope.nextCard = $scope.cardBack;

  /* get the next card from the deck */
  $scope.getCard = function() {
    $scope.nextCard = $scope.deck.getTopCard();
    console.log($scope.nextCard.number);
    if($scope.nextCard == null)
      $scope.nextCard = $scope.cardBack;
  };

  /* initialize current player to 0 */
  var currPlayer = 0;

  /* hide the take and give prompts */
  document.getElementById("wrong").style.display = "none";
  document.getElementById("takeADrink").style.display = "none";
  document.getElementById("correct").style.display = "none";
  document.getElementById("giveADrink").style.display = "none";

  /* first card, red or black */
  $scope.guessColor = function(color) {
    /* get the next card */
    $scope.getCard();

    /* hide the red and black buttons */
    document.getElementById("red_button").style.display = "none";
    document.getElementById("black_button").style.display = "none";

    /* check if the guess is correct and display correct */
    if(color == $scope.nextCard.color) {
      $rootScope.players[currPlayer].giveADrink();
    }
    else {
      $rootScope.players[currPlayer].takeADrink();
    }
  };

  /* second card, higher or lower */
  $scope.guessHigherOrLower = function() {

  };

  /* third card, inside or outside */
  $scope.guessInsideOrOutside = function() {

  };

  /* fourth card, suit */
  $scope.guessSuit = function() {

  }
});
