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
    }

    /* increment drinks given and give a drink to another player */
    function giveADrink(player) {
      drinksGiven++;
      //player.takeADrink();
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

starter.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/blizr',
    templateUrl: 'home.html'
  })
   .state('players', {
     url: '/players',
     controller: 'playersCtrl',
     templateUrl: 'players.html'
   })
    .state('correctOrWrong', {
      url: '/correctOrWrong',
      controller: 'correctOrWrongCtrl',
      templateUrl: 'correctOrWrong.html'
    })
    .state('guessColor', {
      url: '/guessColor',
      controller: 'guessColorCtrl',
      templateUrl: 'guessColor.html'
    })
    .state('overOrUnder', {
      url: '/overOrUnder',
      controller: 'overOrUnderCtrl',
      templateUrl: 'overOrUnder.html'
    })
    .state('inOrOut', {
      url: '/inOrOut',
      controller: 'inOrOutCtrl',
      templateUrl: 'inOrOut.html'
    })
    .state('guessSuit', {
      url: '/guessSuit',
      controller: 'guessSuitCtrl',
      templateUrl: 'guessSuit.html'
    });
  $urlRouterProvider.otherwise('/blizr');
});

/* main page controller */
starter.controller('MainCtrl', function($scope, $state, $ionicModal, $ionicLoading) {
  $scope.toPlayersState = function() {
    $state.go("players");
  }
});


/* players pane controller */
starter.controller('playersCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Player) {
  /* back to home page */
  $scope.toHome = function() {
    $state.go("home");
  };

  /* start RTB, store player names */
  $scope.toTheBus = function() {
    /* store player names */
    $rootScope.playerNames = [];
    for(var i = 0; i < 1; i++)
      $rootScope.playerNames[i] = $scope.answer_one;

    /* create a player for each user input */
    $rootScope.players = [];
    for(var i = 0; i < 1; i++)
      $rootScope.players[i] = new Player($rootScope.playerNames[i]);

    console.log($rootScope.players[0]);

    /* initialize current player to first player */
    $rootScope.currentPlayer = $rootScope.players[0];

    /* initialize current player number to 1 */
    $rootScope.currentPlayerNumber = 1;

    /* go to RTB */
    $state.go("guessColor");
  };
});

/* correct of wrong controller */
starter.controller('correctOrWrongCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player) {

});

/* first round (guess color) controller */
starter.controller('guessColorCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player){
  /* initialize round number to 1 */
  $rootScope.roundNumber = 1;

  /* update the current round name */
  $rootScope.roundName = "Guess the Color!";

  /* display next round information */
  $ionicLoading.show({templateUrl: "roundTransition.html", noBackdrop: true, duration: 3000});

  /* create a new deck */
  $rootScope.deck = new CardDeck();

  /* create a new back of card */
  $rootScope.cardBack = new Card("", 0);
  $rootScope.nextCard = $rootScope.cardBack;

  /* get the next card from the deck */
  $rootScope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    console.log($rootScope.nextCard.number);
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* first card, red or black */
  $scope.guessColor = function(color) {
    /* get the next card */
    $scope.getCard();

    /* check if the guess is correct and set prompt */
    if(color == $scope.nextCard.color) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveADrink();
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give A Drink!";
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeADrink();
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take A Drink!";
    }

    /* transition to correct/wrong prompt */
    $ionicLoading.show({templateUrl: "correctOrWrong.html", noBackdrop: true, duration: 3000});

    /* if the player is the last one, proceed to next round and start with first player, otherwise increment the player
     * number */
    if($rootScope.currentPlayerNumber == $rootScope.players.length) {
      $rootScope.currentPlayerNumber = 1;
      $rootScope.roundNumber = 2;
      $rootScope.currentPlayer = $rootScope.players[0];
    }
    else {
      $rootScope.currentPlayer = $rootScope.players[currentPlayerNumber];
      $rootScope.currentPlayerNumber++;
    }

  };
});

/* second round (guess higher or lower) controller */
starter.controller('overOrUnderCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player) {
  /* update the round info */
  $rootScope.roundName = "Over or Under?";

  /* display next round information */
  $ionicLoading.show({templateUrl: "roundTransition.html", noBackdrop: false, duration: 3000});
});

/* third round (guess in or out) controller */
starter.controller('inOrOutCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                             Player) {
  /* update the round info */
  $rootScope.roundNumber = 3;
  $rootScope.roundName = "Inside or Outside?";

  /* display next round information */
  $ionicLoading.show({templateUrl: "roundTransition.html", noBackdrop: true, duration: 3000});
});

/* fourth round (guess suit) controller */
starter.controller('guessSuitCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                             Player) {
  /* update the round info */
  $rootScope.roundNumber = 4;
  $rootScope.roundName = "Guess the Suit!";

  /* display next round information */
  $ionicLoading.show({templateUrl: "roundTransition.html", noBackdrop: true, duration: 3000});
});
