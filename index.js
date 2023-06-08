$(document).ready(function(){
  var currentQuestion;
  var interval;
  var timeLeft = 10;
  var score = 0;
  var operators = [];
  var highscore = 0;
  
  var updateTimeLeft = function (amount) {
    timeLeft += amount;
    $('#time-left').text(timeLeft);
  };
  
  var updateScore = function (amount) {
    score += amount;
    $('#score').text(score);
  };
  
  var startGame = function () {
    if (!interval) {
      if (timeLeft === 0) {
        updateTimeLeft(10);
        highscoreCheck(score);
        updateScore(-score);
      }
      interval = setInterval(function () {
        updateTimeLeft(-1);
        if (timeLeft === 0) {
          clearInterval(interval);
          interval = undefined;
        }
      }, 1000);  
    }
  };

  var highscoreCheck = function (amount) {
    var newHigh = amount;

    if (newHigh > highscore) {
      highscore = newHigh;
      $('#highscore').text(highscore);
    } else {
      $('#highscore').text(highscore);
    }
  }

  var checkOperators = function () {
    if ($('#question-add').prop('checked') == true) {
      operators.push({
        sign: "+",
        method: function (a, b) { return a + b; }
      });
    } if ($('#question-sub').prop('checked') == true) {
      operators.push({
        sign: "-",
        method: function (a, b) { return a - b; }
      });
    } if ($('#question-mul').prop('checked') == true) {
      operators.push({
        sign: "*",
        method: function (a, b) { return a * b; }
      });
    } if ($('#question-div').prop('checked') == true) {
      operators.push({
        sign: "/",
        method: function (a, b) { return a / b; }
      });
    }
  };
  
  var randomNumberGenerator = function (size) {
    return Math.ceil(Math.random() * size);
  };
  
  var questionGenerator = function () {
    var question = {};
    var num1 = randomNumberGenerator(10);
    var num2 = randomNumberGenerator(10);
    var selectedOperator = Math.floor(Math.random() * operators.length);

    if (operators[selectedOperator].sign == "/") {
      if (num1 < num2) {
        var temp = num1;
        num1 = num2;
        num2 = temp;
      }

      var tempEquation = operators[selectedOperator].method(num1, num2);
      
      question.answer = Math.floor(tempEquation);
      question.equation = String(num1) + String(operators[selectedOperator].sign) + String(num2);

      return question;
    }
    
    if (operators[selectedOperator].sign == "-") {
      if (num1 < num2) {
        var temp = num1;
        num1 = num2;
        num2 = temp;
      }
    }
    
    question.answer = operators[selectedOperator].method(num1, num2);
    question.equation = String(num1) + String(operators[selectedOperator].sign) + String(num2);
    
    return question;
  };
  
  var renderNewQuestion = function () {
    checkOperators();
    highscoreCheck(highscore);
    currentQuestion = questionGenerator();
    $('#equation').text(currentQuestion.equation);  
  };
  
  var checkAnswer = function (userInput, answer) {
    if (userInput === answer) {
      renderNewQuestion();
      $('#user-input').val('');
      updateTimeLeft(+1);
      updateScore(+1);
    }
  };

  var clearOperators = function () {
    operators = [];
  }
  
  $('#user-input').on('keyup', function () {
    startGame();
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  $('.operator').change(function () {
    clearOperators();
    renderNewQuestion();
  })

  renderNewQuestion();
});