// Game constants
const TIME_LIMIT = 5;
const TRANSLATION_DELAY = 2000;

// Game state
let currentWordIndex = 0;
let currentWord = wordList[0];
let score = 0;
let timeLeft = TIME_LIMIT;
let isShowingTranslation = false;
let isGameOver = false;
let timerInterval = null;

// DOM elements
const gameContainer = document.getElementById('game-container');
const gameOverScreen = document.getElementById('game-over');
const koreanWordElement = document.getElementById('korean-word');
const englishTranslationElement = document.getElementById('english-translation');
const typingInput = document.getElementById('typing-input');
const scoreElement = document.querySelector('.score');
const timerElement = document.querySelector('.timer');
const timerProgress = document.querySelector('.timer-progress');
const feedbackElement = document.getElementById('feedback');
const finalScoreElement = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again');

// Initialize the game
function initGame() {
  currentWordIndex = 0;
  currentWord = wordList[0];
  score = 0;
  isShowingTranslation = false;
  isGameOver = false;
  
  updateScoreDisplay();
  displayCurrentWord();
  startTimer();
  
  gameContainer.style.display = 'block';
  gameOverScreen.style.display = 'none';
  
  typingInput.value = '';
  typingInput.focus();
}

// Update the score display
function updateScoreDisplay() {
  scoreElement.textContent = `Score: ${score}`;
}

// Display the current word
function displayCurrentWord() {
  koreanWordElement.textContent = currentWord.korean;
  englishTranslationElement.textContent = currentWord.english;
  
  if (isShowingTranslation) {
    englishTranslationElement.style.display = 'block';
  } else {
    englishTranslationElement.style.display = 'none';
  }
}

// Start the timer
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_LIMIT;
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

// Update the timer display
function updateTimerDisplay() {
  timerElement.textContent = `Time: ${timeLeft}s`;
  timerProgress.style.width = `${(timeLeft / TIME_LIMIT) * 100}%`;
  
  if (timeLeft <= 2) {
    timerElement.classList.add('low-time');
  } else {
    timerElement.classList.remove('low-time');
  }
}

// Move to the next word
function nextWord() {
  isShowingTranslation = false;
  setFeedback('');
  
  currentWordIndex = (currentWordIndex + 1) % wordList.length;
  currentWord = wordList[currentWordIndex];
  
  displayCurrentWord();
  startTimer();
  
  typingInput.value = '';
  typingInput.focus();
  
  gameContainer.classList.remove('correct', 'incorrect');
}

// Handle correct answer
function handleCorrectAnswer() {
  clearInterval(timerInterval);
  score++;
  updateScoreDisplay();
  
  setFeedback('correct');
  gameContainer.classList.add('correct');
  
  isShowingTranslation = true;
  displayCurrentWord();
  
  setTimeout(nextWord, TRANSLATION_DELAY);
}

// Handle incorrect answer
function handleIncorrectAnswer() {
  setFeedback('incorrect');
  gameContainer.classList.add('incorrect');
  
  setTimeout(() => {
    gameContainer.classList.remove('incorrect');
    setFeedback('');
  }, 500);
}

// Handle timeout
function handleTimeout() {
  setFeedback('timeout');
  
  isShowingTranslation = true;
  displayCurrentWord();
  
  setTimeout(nextWord, TRANSLATION_DELAY);
}

// Set feedback message
function setFeedback(type) {
  switch(type) {
    case 'correct':
      feedbackElement.textContent = 'Correct!';
      break;
    case 'incorrect':
      feedbackElement.textContent = 'Try Again!';
      break;
    case 'timeout':
      feedbackElement.textContent = 'Time\'s up!';
      break;
    default:
      feedbackElement.textContent = '';
  }
}

// Show game over screen
function showGameOver() {
  gameContainer.style.display = 'none';
  gameOverScreen.style.display = 'block';
  finalScoreElement.textContent = score;
}

// Event listeners
typingInput.addEventListener('input', (event) => {
  const typedValue = event.target.value;
  
  if (typedValue === currentWord.korean) {
    handleCorrectAnswer();
  }
});

typingInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && typingInput.value !== currentWord.korean) {
    handleIncorrectAnswer();
  }
});

playAgainButton.addEventListener('click', initGame);

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', initGame);
