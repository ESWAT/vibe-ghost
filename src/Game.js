import React, { useState, useEffect, useRef } from 'react';
import wordList from './WordList';

const TIME_LIMIT = 5;
const TRANSLATION_DELAY = 2000;

function Game() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(wordList[0]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isShowingTranslation, setIsShowingTranslation] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState(''); // 'correct', 'incorrect', ''

  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(TIME_LIMIT);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setCurrentWord(wordList[0]);
    setInputValue('');
    setScore(0);
    setIsShowingTranslation(false);
    setIsGameOver(false);
    setFeedback('');
    startTimer();
    if (inputRef.current) {
        inputRef.current.focus();
    }
  };

  const nextWord = () => {
    setIsShowingTranslation(false);
    setFeedback('');
    const nextIndex = (currentWordIndex + 1) % wordList.length;
    if (nextIndex === 0 && currentWordIndex !== 0) {
        // Optionally handle game completion after one loop
        // setIsGameOver(true); // Or just loop indefinitely
    }
    setCurrentWordIndex(nextIndex);
    setCurrentWord(wordList[nextIndex]);
    setInputValue('');
    startTimer();
    if (inputRef.current) {
        inputRef.current.focus();
    }
  };

  const handleCorrectAnswer = () => {
    clearInterval(timerRef.current);
    setScore(score + 1);
    setFeedback('correct');
    setIsShowingTranslation(true);
    setTimeout(() => {
      nextWord();
    }, TRANSLATION_DELAY);
  };

  const handleIncorrectAnswer = () => {
     setFeedback('incorrect');
     // Maybe add a small delay or visual shake
     setTimeout(() => setFeedback(''), 500);
  }

  const handleTimeout = () => {
    // For now, just move to the next word on timeout
    // Could implement a 'lives' system or game over here
    setFeedback('timeout');
    setIsShowingTranslation(true); // Show translation even on timeout
    setTimeout(() => {
        nextWord();
    }, TRANSLATION_DELAY);
  };

  useEffect(() => {
    resetGame(); // Initialize game on mount
    return () => clearInterval(timerRef.current); // Cleanup timer on unmount
  }, []);

   useEffect(() => {
    if (!isShowingTranslation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShowingTranslation]);


  const handleInputChange = (event) => {
    const typedValue = event.target.value;
    setInputValue(typedValue);

    if (typedValue === currentWord.korean) {
      handleCorrectAnswer();
    } else if (typedValue.length >= currentWord.korean.length) {
        // Optional: Provide immediate feedback if length matches but content doesn't
        // handleIncorrectAnswer();
    }
  };

  const handleKeyPress = (event) => {
      if (event.key === 'Enter' && inputValue !== currentWord.korean) {
          handleIncorrectAnswer();
      }
      // Enter key press is implicitly handled by handleInputChange when correct
  }

  if (isGameOver) {
    return (
      <div className="game-container game-over">
        <h2>Game Over</h2>
        <p>{score}</p>
        <button onClick={resetGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div className={`game-container ${feedback}`}>
      <div className="score-timer">
        <span className="score">Score: {score}</span>
        <span className={`timer ${timeLeft <= 2 ? 'low-time' : ''}`}>Time: {timeLeft}s</span>
      </div>
      
      <div className="timer-bar">
        <div 
          className="timer-progress" 
          style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
        ></div>
      </div>

      <div className="word-display">
        {isShowingTranslation ? (
          <>
            <p className="korean-word">{currentWord.korean}</p>
            <p className="english-translation">{currentWord.english}</p>
          </>
        ) : (
          <p className="korean-word prompt">{currentWord.korean}</p>
        )}
      </div>

      {!isShowingTranslation && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type here..."
          className="typing-input"
          lang="ko"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          autoFocus
        />
      )}
       <div className="feedback-indicator">
            {feedback === 'correct' && 'Correct!'}
            {feedback === 'incorrect' && 'Try Again!'}
            {feedback === 'timeout' && 'Time\'s up!'}
       </div>
    </div>
  );
}

export default Game;
