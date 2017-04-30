// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var starter = angular.module('starter', ['ionic', 'ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
  ngFB.init({appId: '1904085506531039'});
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
      cards.push(card);
    }

    /* get cards */
    function getCards() {
      return cards;
    }

    /* accessible functions */
    return {
      getName: getName,
      takeADrink: takeADrink,
      giveADrink: giveADrink,
      addCard: addCard,
      getCards: getCards
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
    .state('roundTransition', {
      url: '/roundTransition',
      controller: 'roundTransitionCtrl',
      templateUrl: 'roundTransition.html'
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
starter.controller('MainCtrl', function($scope, $state, $ionicModal, $ionicLoading, $timeout, ngFB) {
  $scope.toPlayersState = function() {
    $state.go("players");
  }
  $scope.fbLogin = function () {
    ngFB.login({scope: 'email,publish_actions'}).then(
      function (response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          $scope.loginResult = "Good.";
          $scope.closeLogin();
        } else {
          alert('Facebook login failed');
          $scope.loginResult = "Bad.";
        }
      });
  };
  $scope.share = function () {
    ngFB.api({
      method: 'POST',
      path: '/me/feed',
      params: {
        message: "I played Blitzr!"
      }
    }).then(
      function () {
        alert('The session was shared on Facebook');
      },
      function () {
        alert('An error occurred while sharing this session on Facebook');
      });
  };
});


/* players pane controller */
starter.controller('playersCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading,
                                           Card, CardDeck, Player, $ionicPopup) {
  /* back to home page */
  $scope.toHome = function() {
    $state.go("home");
  };

  /* safe drinking alert */
  $scope.showAlert = function() {

    var alertPopup = $ionicPopup.alert({
      title: 'Warning',
      template: 'Please drink responsibly.'
    });

    alertPopup.then(function(res) {
      $state.go("rideTheBus")
    });
  };

  /* start RTB, store player names */
  $scope.toTheBus = function() {
    /* store player names */
    $rootScope.playerNames = [];
    /*for(var i = 0; i < 1; i++) */
      $rootScope.playerNames[0] = $scope.answer_one;
      $rootScope.playerNames[1] = $scope.answer_two;

    $scope.listOfPlayers = [{
      value: null
    }];

    $scope.addPlayer = function () {
      $scope.listOfPlayers.push({
        value: null
      });
    };

    $scope.removePlayer = function (index) {
      $scope.listOfPlayers.splice(index, 1);
    };


    /* create a player for each user input */
    $rootScope.players = [];
    for(var i = 0; i < $rootScope.playerNames.length; i++)
      $rootScope.players[i] = new Player($rootScope.playerNames[i]);

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

    /* safe drinking alert then go to RTB */
    var alertPopup = $ionicPopup.alert({
      title: 'Warning!',
      template: 'Please drink responsibly.'
    });

    alertPopup.then(function(res) {
      $state.go("roundTransition")
    });
    /*
    $state.go("roundTransition");
    */
  };
});

/* correct or wrong controller, also determines next state based on round */
starter.controller('correctOrWrongCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player) {

  /* go to the next player on a click */
  $scope.toNextPlayer = function() {
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

    /* go to the transition page */
    $state.go("roundTransition");
  };

});

/* correct or wrong controller, also determines next state based on round */
starter.controller('roundTransitionCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                                   Player) {

  /* go to the next round on a click */
  $scope.toNextRound = function () {
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

/* first round (guess color) controller */
starter.controller('guessColorCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player, $timeout){

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    console.log($rootScope.nextCard.number);
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* first card, red or black */
  $scope.guessColor = function(color) {
    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* check if the guess is correct and set prompt, go to the correct or wrong state */
    if(color == $scope.nextCard.color) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveADrink();
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give A Drink!";
      $state.go("correctOrWrong");
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeADrink();
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take A Drink!";
      $state.go("correctOrWrong");
    }
  };
});

/* second round (guess higher or lower) controller */
starter.controller('overOrUnderCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player) {
  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    console.log($rootScope.nextCard.number);
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* second card, over or under */
  $scope.overOrUnder = function(guess) {
    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* check if the guess is correct and set prompt, go to the correct or wrong state */
    if((guess == "over" && $rootScope.nextCard.number > $rootScope.currentPlayer.getCards()[0].number) ||
      (guess == "under" && $rootScope.nextCard.number < $rootScope.currentPlayer.getCards()[0].number)) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveADrink();
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give A Drink!";
      $state.go("correctOrWrong");
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeADrink();
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take A Drink!";
      $state.go("correctOrWrong");
    }
  };
});

/* third round (guess in or out) controller */
starter.controller('inOrOutCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                             Player) {
  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    console.log($rootScope.nextCard.number);
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* first card, red or black */
  $scope.inOrOut = function(guess) {
    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* get the bounds on the guess */
    var max = Math.max($rootScope.currentPlayer.getCards()[0].number, $rootScope.currentPlayer.getCards()[1].number);
    var min = Math.min($rootScope.currentPlayer.getCards()[0].number, $rootScope.currentPlayer.getCards()[1].number);

    /* check if the guess is correct and set prompt, go to the correct or wrong state */
    if((guess == "inside" && ($rootScope.nextCard.number < max || $rootScope.nextCard.number > min))||
      (guess == "outside" && ($rootScope.nextCard.number > max || $rootScope.nextCard.number < min))) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveADrink();
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give A Drink!";
      $state.go("correctOrWrong");
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeADrink();
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take A Drink!";
      $state.go("correctOrWrong");
    }
  };
});

/* fourth round (guess suit) controller */
starter.controller('guessSuitCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                             Player) {

});