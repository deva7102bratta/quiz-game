// DOM ELEMENTS
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");

const currentQuestionSpan = document.getElementById("current-question");
const scoreSpan = document.getElementById("score");

const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");

const restartBtn = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const correctAns = document.getElementById("correct-ans")

// STATE
let score = 0;
let current = 0;
const total = 5;
let locked = false;
progressBar.style.width = 0
// FETCH QUESTION
async function getQuestion() {
  const res = await fetch("https://opentdb.com/api.php?amount=1");
  const data = await res.json();

  const q = data.results[0];

  let options = [...q.incorrect_answers];
  const index = Math.floor(Math.random() * (options.length + 1));
  options.splice(index, 0, q.correct_answer);

  return [q.question, q.correct_answer, options];
}

// LOAD QUESTION
async function loadQuestion() {
  
  if (current >= total) {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScoreSpan.innerHTML = score;
    maxScoreSpan.innerHTML = total;
    return;
  }

  const [question, correct, options] = await getQuestion();

  questionText.innerHTML = question;
  answersContainer.innerHTML = "";
  currentQuestionSpan.innerHTML = current + 1;

  let i = 0;

const interval = setInterval(() => {

  if (i >= options.length) {
    clearInterval(interval);
    return;
  }

  const opt = options[i];

  const btn = document.createElement("button");
  btn.classList.add("answer-btn");
  btn.innerHTML = opt;

  // ✅ CLICK INSIDE LOOP (IMPORTANT FIX)
  btn.onclick = () => {

    if (locked) return;
    locked = true;

    const allBtns = answersContainer.querySelectorAll("button");
    allBtns.forEach(b => b.disabled = true);

    if (opt === correct) {
      score++;
      scoreSpan.innerHTML = score;
      btn.classList.add("correct");
    } else {
      btn.classList.add("incorrect");
    }

    current++;
    correctAns.innerHTML = correct
  progressBar.style.width = (current/total)*100 +"%"
    setTimeout(() => {
      locked = false;
      loadQuestion();
    }, 400);
  };

  answersContainer.appendChild(btn);

  i++;

}, 1000);
}

// START QUIZ
startBtn.onclick = () => {
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  score = 0;
  current = 0;
  scoreSpan.innerHTML = 0;

  loadQuestion();
};

// RESTART QUIZ
restartBtn.onclick = () => {
  resultScreen.classList.remove("active");
  quizScreen.classList.add("active");
  progressBar.style.width = 0
  score = 0;
  current = 0;
  scoreSpan.innerHTML = 0;

  loadQuestion();
};