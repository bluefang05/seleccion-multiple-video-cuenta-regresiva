// Variables
let timer = document.getElementById("timer");
let seconds = 60;
let secondsRef = seconds;
let roundNumber = 0;
let answerAmount = 4;
let score = 0;
let isMuted = false;
document.getElementById("muteButton").addEventListener("click", toggleMute);


// Game setup
Swal.fire({
  title: "Selecciona la emoción correcta",
  icon: 'info',
  showCancelButton: false,
  confirmButtonText: 'OK'
}).then((result) => {
  if (result.isConfirmed) {
    setTimeout(() => {
      gamestart();
      playBackgroundMusic();
    }, 100); // Espera 1000 ms (1 segundo) antes de iniciar el juego y reproducir la música de fondo
  }
});


// Game logic functions
function gamestart() {
  setRound();
  timer.innerHTML = seconds;
  let interval = setInterval(function () {
    timer.innerHTML = seconds;
    seconds -= 1;

    if (seconds < 0) {
      clearInterval(interval);
      finished.play();
      bg.pause();
      finishGame();
    }

    if (seconds < secondsRef * 0.2) {
      bg.playbackRate = 2;
    }
  }, 1000);
}

function setRound() {
  roundNumber = getRandomIndex(questions.length);
  document.getElementById("answerBox").innerHTML = "";
  let selection = [];
  let questionsRef = [];

  for (let i = 0; i < questions.length; i++) {
    questionsRef.push(questions[i][1]);
  }

  questionsRef = Array.from(new Set(questionsRef));
  let correctAnswer = questions[roundNumber][1];
  selection.push("<div class='answer good'>" + correctAnswer);
  questionsRef = questionsRef.filter((item) => item !== correctAnswer);
  shuffle(questionsRef);

  for (let i = 1; i < answerAmount; i++) {
    selection.push("<div class='answer bad'>" + questionsRef[0]);
    questionsRef.splice(0, 1);
  }

  document.getElementById("questionBox").innerHTML =
    "<video autoplay controls loop id='portrait' src='assets/images/questions/" + questions[roundNumber][0] + "'>";
  shuffle(selection);
  selection.forEach((element) => {
    document.getElementById("answerBox").innerHTML += element;
  });

  makeButtonsClickable("answer");
}

function handleAnswerClick(isCorrect) {
  if (isCorrect) {
    score++;
    document.getElementById("score").innerHTML = score;
    right.play();
    setRound();
  } else {
    wrong.play();
    document.getElementById("timer-container").classList.add("shake");
    document.getElementById("timer-container").classList.add("red");
    setTimeout(function () {
      document.getElementById("timer-container").classList.remove("shake");
      document.getElementById("timer-container").classList.remove("red");
    }, 500);
  }
}

function finishGame() {
  Swal.fire({
    title: `Tu puntuación es ${score}`,
    icon: 'info',
    confirmButtonText: 'Reiniciar'
  }).then(() => {
    location.reload();
  });
}

// Utility functions
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomIndex(n) {
  return Math.floor(Math.random() * n);
}

function makeButtonsClickable(className) {
  var buttons = document.getElementsByClassName(className);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      handleAnswerClick(this.classList.contains("good"));
    };
  }
}




function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    muteSounds();
    document.getElementById("muteButton").innerHTML = "Unmute";
  } else {
    unmuteSounds();
    document.getElementById("muteButton").innerHTML = "Mute";
  }
}

function muteSounds() {
  bg.muted = true;
  right.muted = true;
  wrong.muted = true;
  finished.muted = true;
}

function unmuteSounds() {
  bg.muted = false;
  right.muted = false;
  wrong.muted = false;
  finished.muted = false;
}