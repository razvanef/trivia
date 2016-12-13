exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function () {
    var players = [],
        places = [],
        purses = [],
        inPenaltyBox = [],

        popQuestions = [],
        scienceQuestions = [],
        sportsQuestions = [],
        rockQuestions = [],

        currentPlayer = 0,
        isGettingOutOfPenaltyBox = false,
        category = {
            "POP": "Pop",
            "SCIENCE": "Science",
            "SPORTS": "Sports",
            "ROCK": "Rock"
        }

    var didPlayerWin = function () {
        return !(purses[currentPlayer] == 6)
    };

    var currentCategory = function () {
        if ([0, 4, 8].indexOf(places[currentPlayer]) > -1)
            return category.POP;
        else if ([1, 5, 9].indexOf(places[currentPlayer]) > -1)
            return category.SCIENCE;
        else if ([2, 6, 10].indexOf(places[currentPlayer]) > -1)
            return category.SPORTS;
        return category.ROCK;
    };

    this.createRockQuestion = function (index) {
        return "Rock Question " + index;
    };

    for (var i = 0; i < 50; i++) {
        popQuestions.push("Pop Question " + i);
        scienceQuestions.push("Science Question " + i);
        sportsQuestions.push("Sports Question " + i);
        rockQuestions.push(this.createRockQuestion(i));
    };

    this.isPlayable = function (howManyPlayers) {
        return howManyPlayers >= 2;
    };

    this.add = function (playerName) {
        players.push(playerName);
        places[this.howManyPlayers() - 1] = 0;
        purses[this.howManyPlayers() - 1] = 0;
        inPenaltyBox[this.howManyPlayers() - 1] = false;

        console.log(playerName + " was added");
        console.log("They are player number " + players.length);

        return true;
    };

    this.howManyPlayers = function () {
        return players.length;
    };


    var askQuestion = function () {
        if (currentCategory() == category.POP)
            console.log(popQuestions.shift());
        else if (currentCategory() == category.SCIENCE)
            console.log(scienceQuestions.shift());
        else if (currentCategory() == category.SPORTS)
            console.log(sportsQuestions.shift());
        else if (currentCategory() == category.ROCK)
            console.log(rockQuestions.shift());
    };

    this.roll = function (roll) {
        console.log(players[currentPlayer] + " is the current player");
        console.log("They have rolled a " + roll);

        if (inPenaltyBox[currentPlayer]) {
            if (roll % 2 != 0) {
                isGettingOutOfPenaltyBox = true;

                console.log(players[currentPlayer] + " is getting out of the penalty box");

                changePlace(roll);

            } else {
                console.log(players[currentPlayer] + " is not getting out of the penalty box");

                isGettingOutOfPenaltyBox = false;
            }
        } else {
            changePlace(roll);
        }
    };

    var changePlace = function (roll) {
        places[currentPlayer] = places[currentPlayer] + roll;

        if (places[currentPlayer] > 11) {
            places[currentPlayer] = places[currentPlayer] - 12;
        }

        console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
        console.log("The category is " + currentCategory());

        askQuestion();
    }

    this.wasCorrectlyAnswered = function () {
        if (inPenaltyBox[currentPlayer]) {
            if (isGettingOutOfPenaltyBox) {
                return setWinner();
            } else {
                changeCurrentPlayer();
                return true;
            }
        } else {
            return setWinner();
        }
    };

    var setWinner = function () {
        console.log("Answer was correct!!!!");

        purses[currentPlayer] += 1;
        console.log(players[currentPlayer] + " now has " +
            purses[currentPlayer] + " Gold Coins.");

        var winner = didPlayerWin();

        changeCurrentPlayer();

        return winner;
    }

    var changeCurrentPlayer = function() {
        currentPlayer += 1;
        if (currentPlayer == players.length)
            currentPlayer = 0;
    }

    this.wrongAnswer = function () {
        console.log('Question was incorrectly answered');
        console.log(players[currentPlayer] + " was sent to the penalty box");
        inPenaltyBox[currentPlayer] = true;

        changeCurrentPlayer();
        return true;
    };
};

var notAWinner = false;

var game = new Game();

game.add('Chet');
game.add('Pat');
game.add('Sue');

do {

    game.roll(Math.floor(Math.random() * 6) + 1);

    if (Math.floor(Math.random() * 10) == 7) {
        notAWinner = game.wrongAnswer();
    } else {
        notAWinner = game.wasCorrectlyAnswered();
    }

} while (notAWinner);