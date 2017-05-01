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
    var drinksToGive = 0;

    /* constructor */
    function init() {
      name = _name;
      cards = [];
      drinksTaken = 0;
      drinksGiven = 0;
      drinksToGive = 0;
    }

    /* call constructor */
    init();

    /* get name */
    function getName() {
      return name;
    }

    /* increment drinks taken */
    function takeDrinks(drinks) {
      drinksTaken += drinks;
    }

    /*  */
    function giveDrinks(drinks) {
      drinksToGive = drinks;
    }

    /* get the number of drinks to give */
    function getDrinksToGive(){
      return drinksToGive;
    }

    function givePlayerADrink(player){
      player.takeDrinks(1);
      drinksToGive--;
      drinksGiven++;
    }

    /* add card */
    function addCard(card) {
      cards.push(card);
    }

    /* get cards */
    function getCards() {
      return cards;
    }

    /* get number of drinks taken */
    function getTaken() {
      return drinksTaken;
    }

    /* get number of drinks given */
    function getGiven() {
      return drinksGiven;
    }

    /* accessible functions */
    return {
      getName: getName,
      takeDrinks: takeDrinks,
      giveDrinks: giveDrinks,
      addCard: addCard,
      getCards: getCards,
      getTaken: getTaken,
      getGiven: getGiven,
      getDrinksToGive: getDrinksToGive,
      givePlayerADrink: givePlayerADrink
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
    .state('roundTransition', {
      url: '/roundTransition',
      controller: 'roundTransitionCtrl',
      templateUrl: 'roundTransition.html',
      cache: false
    })
    .state('givePlayersDrinks', {
      url: '/givePlayersDrinks',
      controller: 'givePlayersDrinksCtrl',
      templateUrl: 'givePlayersDrinks.html',
      cache: false
    })
    .state('guessColor', {
      url: '/guessColor',
      controller: 'guessColorCtrl',
      templateUrl: 'guessColor.html',
      cache: false
    })
    .state('overOrUnder', {
      url: '/overOrUnder',
      controller: 'overOrUnderCtrl',
      templateUrl: 'overOrUnder.html',
      cache: false
    })
    .state('inOrOut', {
      url: '/inOrOut',
      controller: 'inOrOutCtrl',
      templateUrl: 'inOrOut.html',
      cache: false
    })
    .state('guessSuit', {
      url: '/guessSuit',
      controller: 'guessSuitCtrl',
      templateUrl: 'guessSuit.html',
      cache: false
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
starter.controller('playersCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading,
                                           Card, CardDeck, Player) {
  /* back to home page */
  $scope.toHome = function() {
    $state.go("home");
  };

  /* list of players */
  $scope.listOfPlayers = [{
    value: null
  }];

  /* remove add player */
  $scope.addPlayer = function () {
    $scope.listOfPlayers.push({
      value: null
    });
  };

  /* remove player */
  $scope.removePlayer = function (index) {
    $scope.listOfPlayers.splice(index, 1);
  };

  /* start RTB, store player names */
  $scope.toTheBus = function() {

    /* create a player for each user input */
    $rootScope.players = [];
    for(var i = 0; i < $scope.listOfPlayers.length; i++)
      $rootScope.players[i] = new Player($scope.listOfPlayers[i].value);

    /* initialize current player to first player */
    $rootScope.currentPlayer = $rootScope.players[0];

    /* initialize current player number to 1 */
    $rootScope.currentPlayerNumber = 1;

    /* initialize round number to 1 */
    $rootScope.roundNumber = 1;

    /* initialize round name to red or black */
    $rootScope.roundName = "Red or Black?";

    /* create a new deck */
    $rootScope.deck = new CardDeck();

    /* create a new back of card */
    $rootScope.cardBack = new Card("", 0);
    $rootScope.nextCard = $rootScope.cardBack;

    /* go to RTB */
    $state.go("roundTransition");
  };
});


/* correct or wrong controller, also determines next state based on round */
starter.controller('roundTransitionCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                                   Player) {

  /* go to the next round on a click */
  $scope.toNextRound = function () {
    /* set the next card to display the back of a card */
    $rootScope.nextCard = $rootScope.cardBack;

    /* reset correct/wrong and take/give */
    $rootScope.correctOrWrong = "";
    $rootScope.takeOrGive = "";

    /* go to the next round and/or player */
    if ($rootScope.roundNumber == 1)
      $state.go("guessColor");
    else if ($rootScope.roundNumber == 2)
      $state.go("overOrUnder");
    else if ($rootScope.roundNumber == 3)
      $state.go("inOrOut");
    else if ($rootScope.roundNumber == 4)
      $state.go("guessSuit");
  };
});

starter.controller('givePlayersDrinksCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                                     Player) {
  /* get list of players, previous player, and drinks able to give */
  $scope.listOfPlayers = $rootScope.players;
  $scope.prevPlayer = $rootScope.previousPlayer;
  $scope.remainingDrinks = $scope.prevPlayer.getDrinksToGive();

  /* give a drink to the desired player */
  $scope.giveDrink = function(player){
    $scope.remainingDrinks--;
    $scope.prevPlayer.givePlayerADrink(player);
    /* if there are no more drinks to give, go to transition page */
    if($scope.remainingDrinks <= 0){
      $state.go("roundTransition");
    }
  };
});

/* first round (guess color) controller */
starter.controller('guessColorCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player){

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* enable next player button and hide red/black */
  $scope.enableNext = function() {
    document.getElementById("colorTransButton").disabled = false;
    document.getElementById("red_button").style.visibility = "hidden";
    document.getElementById("black_button").style.visibility = "hidden";
  };

  /* disable next player button and show red/black */
  $scope.disableNext = function() {
    document.getElementById("colorTransButton").disabled = true;
    document.getElementById("red_button").style.visibility = "visible";
    document.getElementById("black_button").style.visibility = "visible";
    console.log("disabling");
  };

  /* every time the page loads, the next player button begins disabled */
  window.onload = $scope.disableNext();

  /* first card, red or black */
  $scope.guessColor = function(color) {

    /* enable the next player button */
    $scope.enableNext();

    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* check if the guess is correct and set prompt */
    if(color == $rootScope.nextCard.color) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(1);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give A Drink!";
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(1);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take A Drink!";
    }
  };

  /* go to the next player on a click */
  $scope.toNextPlayer = function() {
    /* store the previous player */
    $rootScope.previousPlayer = $rootScope.currentPlayer;

    /* determine if the current player is the last in the round, set proper variables */
    if($rootScope.currentPlayerNumber == $rootScope.players.length) {
      $rootScope.currentPlayerNumber = 1;
      $rootScope.currentPlayer = $rootScope.players[0];
      $rootScope.roundNumber++;
    }
    else {
      $rootScope.currentPlayer = $rootScope.players[$rootScope.currentPlayerNumber];
      $rootScope.currentPlayerNumber++;
    }

    /* update round name */
    if($rootScope.roundNumber == 1)
      $rootScope.roundName = "Red or Black?";
    else if($rootScope.roundNumber == 2)
      $rootScope.roundName = "Higher or Lower?";
    else if($rootScope.roundNumber == 3)
      $rootScope.roundName = "Inside or Outside?";
    else if($rootScope.roundNumber == 4)
      $rootScope.roundName = "Guess the Suit!";

    /* go to the give drinks page if there are drinks to give, otherwise the transition page */
    if($rootScope.previousPlayer.getDrinksToGive() > 0)
      $state.go("givePlayersDrinks");
    else
      $state.go("roundTransition");
  };
});

/* second round (guess higher or lower) controller */
starter.controller('overOrUnderCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player) {

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* enable next player button and hide over/under */
  $scope.enableNext = function() {
    document.getElementById("overOrUnderTransButton").disabled = false;
    document.getElementById("over_button").style.visibility = "hidden";
    document.getElementById("under_button").style.visibility = "hidden";
  };

  /* disable next player button and show over/under */
  $scope.disableNext = function() {
    document.getElementById("overOrUnderTransButton").disabled = true;
    document.getElementById("over_button").style.visibility = "visible";
    document.getElementById("under_button").style.visibility = "visible";
  };

  /* every time the page loads, the next player button begins disabled */
  window.onload = $scope.disableNext;

  /* second card, over or under */
  $scope.overOrUnder = function(guess) {

    /* enable the next player button */
    $scope.enableNext();

    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* get the first card number */
    var firstCardNumber = $rootScope.currentPlayer.getCards()[0].number;

    /* check if the guess is correct and set prompt, go to the correct or wrong state */
    if((guess == "over" && $rootScope.nextCard.number > firstCardNumber) ||
      (guess == "under" && $rootScope.nextCard.number < firstCardNumber)) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(2);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give Two Drinks!";
    }
    else if($rootScope.nextCard.number == firstCardNumber) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(4);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Four Drinks!";
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(2);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Two Drinks!";
    }
  };

  /* go to the next player on a click */
  $scope.toNextPlayer = function() {
    /* store the previous player */
    $rootScope.previousPlayer = $rootScope.currentPlayer;

    /* determine if the current player is the last in the round, set proper variables */
    if($rootScope.currentPlayerNumber == $rootScope.players.length) {
      $rootScope.currentPlayerNumber = 1;
      $rootScope.currentPlayer = $rootScope.players[0];
      $rootScope.roundNumber++;
    }
    else {
      $rootScope.currentPlayer = $rootScope.players[$rootScope.currentPlayerNumber];
      $rootScope.currentPlayerNumber++;
    }

    /* update round name */
    if($rootScope.roundNumber == 1)
      $rootScope.roundName = "Red or Black?";
    else if($rootScope.roundNumber == 2)
      $rootScope.roundName = "Higher or Lower?";
    else if($rootScope.roundNumber == 3)
      $rootScope.roundName = "Inside or Outside?";
    else if($rootScope.roundNumber == 4)
      $rootScope.roundName = "Guess the Suit!";

    /* go to the give drinks page if there are drinks to give, otherwise the transition page */
    if($rootScope.previousPlayer.getDrinksToGive() > 0)
      $state.go("givePlayersDrinks");
    else
      $state.go("roundTransition");
  };
});

/* third round (guess in or out) controller */
starter.controller('inOrOutCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                             Player) {

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* enable next player button and hide in/out buttons*/
  $scope.enableNext = function() {
    document.getElementById("inOrOutTransButton").disabled = false;
    document.getElementById("over_button").style.visibility = "hidden";
    document.getElementById("under_button").style.visibility = "hidden";
  };

  /* disable next player button and show in/out buttons */
  $scope.disableNext = function() {
    document.getElementById("inOrOutTransButton").disabled = true;
    document.getElementById("over_button").style.visibility = "visible";
    document.getElementById("under_button").style.visibility = "visible";
  };

  /* every time the page loads, the next player button begins disabled */
  window.onload = $scope.disableNext;

  /* third card, inside or outside */
  $scope.inOrOut = function(guess) {

    /* enable the next player button */
    $scope.enableNext();

    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* get the first two cards on the guess */
    var firstCardNumber = $rootScope.currentPlayer.getCards()[0].number;
    var secondCardNumber = $rootScope.currentPlayer.getCards()[1].number;

    /* get the bounds */
    var upper = Math.max(firstCardNumber, secondCardNumber);
    var lower = Math.min(firstCardNumber, secondCardNumber);

    /* check if the guess is correct and set prompt */
    if(guess == "outside" && ($rootScope.nextCard.number < lower || $rootScope.nextCard.number > upper)) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(3);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give Three Drinks!";
    }
    else if((guess == "inside" && ($rootScope.nextCard.number > lower && $rootScope.nextCard.number < upper))) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(3);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give Three Drinks!";
    }
    else if($rootScope.nextCard.number == lower || $rootScope.nextCard.number == upper) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(6);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Six Drinks!";
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(3);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Three Drinks!";
    }
  };

  /* go to the next player on a click */
  $scope.toNextPlayer = function() {
    /* store the current player */
    $rootScope.previousPlayer = $rootScope.currentPlayer;

    /* determine if the current player is the last in the round, set proper variables */
    if($rootScope.currentPlayerNumber == $rootScope.players.length) {
      $rootScope.currentPlayerNumber = 1;
      $rootScope.currentPlayer = $rootScope.players[0];
      $rootScope.roundNumber++;
    }
    else {
      $rootScope.currentPlayer = $rootScope.players[$rootScope.currentPlayerNumber];
      $rootScope.currentPlayerNumber++;
    }

    /* update round name */
    if($rootScope.roundNumber == 1)
      $rootScope.roundName = "Red or Black?";
    else if($rootScope.roundNumber == 2)
      $rootScope.roundName = "Higher or Lower?";
    else if($rootScope.roundNumber == 3)
      $rootScope.roundName = "Inside or Outside?";
    else if($rootScope.roundNumber == 4)
      $rootScope.roundName = "Guess the Suit!";

    /* go to the give drinks page if there are drinks to give, otherwise the transition page */
    if($rootScope.previousPlayer.getDrinksToGive() > 0)
      $state.go("givePlayersDrinks");
    else
      $state.go("roundTransition");
  };
});

/* fourth round (guess suit) controller */
starter.controller('guessSuitCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                             Player) {

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* enable next player button and hide suit buttons */
  $scope.enableNext = function() {
    document.getElementById("suitTransButton").disabled = false;
    document.getElementById("diamonds_button").style.visibility = "hidden";
    document.getElementById("hearts_button").style.visibility = "hidden";
    document.getElementById("spades_button").style.visibility = "hidden";
    document.getElementById("clubs_button").style.visibility = "hidden";
  };

  /* disable next player button and show suit buttons */
  $scope.disableNext = function() {
    document.getElementById("suitTransButton").disabled = true;
    document.getElementById("diamonds_button").style.visibility = "visible";
    document.getElementById("hearts_button").style.visibility = "visible";
    document.getElementById("spades_button").style.visibility = "visible";
    document.getElementById("clubs_button").style.visibility = "visible";
  };

  /* every time the page loads, the next player button begins disabled */
  window.onload = $scope.disableNext;

  /* first card, red or black */
  $scope.guessSuit = function(suit) {

    /* enable the next player button */
    $scope.enableNext();

    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* check if the guess is correct and set prompt */
    if(suit == $rootScope.nextCard.suit) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(4);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give Four Drinks!";
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(4);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Four Drinks!";
    }
  };

  /* go to the next player on a click */
  $scope.toNextPlayer = function() {
    /* store the current player */
    $rootScope.previousPlayer = $rootScope.currentPlayer;

    /* determine if the current player is the last in the round, set proper variables */
    if($rootScope.currentPlayerNumber == $rootScope.players.length) {
      $rootScope.currentPlayerNumber = 1;
      $rootScope.currentPlayer = $rootScope.players[0];
      $rootScope.roundNumber++;
    }
    else {
      $rootScope.currentPlayer = $rootScope.players[$rootScope.currentPlayerNumber];
      $rootScope.currentPlayerNumber++;
    }

    /* update round name */
    if($rootScope.roundNumber == 1)
      $rootScope.roundName = "Red or Black?";
    else if($rootScope.roundNumber == 2)
      $rootScope.roundName = "Higher or Lower?";
    else if($rootScope.roundNumber == 3)
      $rootScope.roundName = "Inside or Outside?";
    else if($rootScope.roundNumber == 4)
      $rootScope.roundName = "Guess the Suit!";

    /* go to the give drinks page if there are drinks to give, otherwise the transition page */
    if($rootScope.previousPlayer.getDrinksToGive() > 0)
      $state.go("givePlayersDrinks");
    else
      $state.go("roundTransition");
  };
});
