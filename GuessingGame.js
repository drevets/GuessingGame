function generateWinningNumber() {
  return Math.floor(Math.random()*100+1)
}

//have no idea why this isn't working

function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(number) {
  if (number < 1 || number > 100) {
    throw "That is an invalid guess."
  } else if (typeof number !== "number") {
    throw "That is an invalid guess."
  }
  this.playersGuess = number;
  return this.checkGuess()
}

Game.prototype.checkGuess = function(){
  if (this.isLower()) {
    $('#subtitle').text('Guess higher!')
  } if (!this.isLower()) {
    $('#subtitle').text('Guess lower!')
  }
  if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
    return "You have already guessed that number."
  }
  this.pastGuesses.push(this.playersGuess)
  if (this.playersGuess === this.winningNumber) {
    return "You Win!"
  } if (this.pastGuesses.length > 4) {
    return "You Lose."
  }
  if (this.difference() <= 10) {
    $('#title').text("You're burning up!")
    return "You're burning up!"
  } if (this.difference() >=10 && this.difference() < 25) {
    $('#title').text("You're lukewarm.")
    return "You're lukewarm."
  } if (this.difference() >= 25 && this.difference() < 50) {
    $('#title').text("You're a bit chilly.")
    return "You're a bit chilly."
  } if (this.difference() >= 50 && this.difference() < 100) {
    $('#title').text("You're ice cold!")
    return "You're ice cold!"
  }
}

function newGame(){
  return new Game()
}

//generates array with a length of three
//includes the winning number
//calls generateWinningNumber to generate rest of numbers to fill array
//calls the shuffle function

Game.prototype.provideHint = function(){
  var hintArray = [this.winningNumber];
  for (var i = 0; i < 2; i++) {
    hintArray.push(generateWinningNumber())
  }
  return shuffle(hintArray)
}

// // Before we start making the actual game interface,
// we're going to need a game instance to work with. After the DOM has finished loading, create a new game instance.
// // When a user presses the submit button,
// extract the value from the input, #player-input.
// // After the player has submitted their guess, clear the input element.
// // Pass the submitted value into playersGuessSubmission,
// and console.log the output. Note: The value extracted from input elements will always be a string.
// // Extra: When a user presses the 'enter' key,
// repeat steps 2, 3, and 4. You'll probably be
// duplicating a lot of code here, so figure out how to be as DRY (Don't repeat yourself) as possible.

$(document).ready(function() {
  var game = new Game();
  $('#hint').click(function(){
    var hintArray = game.provideHint();
    $('#title').text(hintArray)
  })
  $('#reset').click(function(){
    game = new Game();
    $('.guess').text('#')
    $('#title').text("Guessing Game!")
    $('#subtitle').text("Guess a number between one and one hundred!")
    $('#submit').prop('disabled', false)
    $('#hint').prop('disabled', false)
  })
  $('#submit').click(function(e) {
    gamePlay(game)
  })
  $('#player-input').keypress(function(event){
    if (event.which == 13) {
      gamePlay(game)
    }
  })
});

function gamePlay(game){
  var guess = + $('#player-input').val();
  var submitted = game.playersGuessSubmission(guess);
  var guessNum = game.pastGuesses.length;
  var guessDict = {
    1: $('.guess').first(),
    2: $('.guess').first().next(),
    3: $('.guess').first().next().next(),
    4: $('.guess').first().next().next().next(),
    5: $('.guess').last()
  }
  console.log(submitted)
  if (submitted === 'You Win!' || submitted === 'You Lose.') {
    $('#title').text(submitted);
    $('#subtitle').text('Hit "Reset" to play again!')
    $('#submit').prop('disabled', true)
    $('#hint').prop('disabled', true)
  }
  if (submitted === "You have already guessed that number.") {
    $('#title').text('You already guessed that!')
  } else {
    var currGuess = guessDict[guessNum];
    currGuess.text(guess)
  }
  $('#player-input').val('');
}
