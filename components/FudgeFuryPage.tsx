
import React, { useState, useEffect, useRef } from 'react';
import { PageProps, FudgeItem } from '../types';
import { GAME_SOUNDS } from '../constants';
import HomeIcon from './icons/HomeIcon';
import StarIcon from './icons/StarIcon';

const FudgeFuryPage: React.FC<PageProps> = ({ setCurrentPage, audioControls }) => {
  const { playClip } = audioControls;
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [fudgeItems, setFudgeItems] = useState<FudgeItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const animationFrameId = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const gameEndedRef = useRef(false);

  const startFudgeFury = () => {
    setScore(0);
    setTimeLeft(30);
    setFudgeItems([]);
    setGameActive(true);
    gameEndedRef.current = false;
    playClip(GAME_SOUNDS.START);
  };

  const handleFudgeClick = (clickedItem: FudgeItem) => {
    if (!gameActive) return;

    if (clickedItem.type === 'fudge') {
      playClip(GAME_SOUNDS.FUDGE_SUCCESS);
      setScore(prev => prev + 10);
      setFudgeItems(prev => prev.filter(f => f.id !== clickedItem.id));
    } else {
      playClip(GAME_SOUNDS.FUDGE_FAIL);
      setScore(prev => Math.max(0, prev - 5));
    }
  };
  
  // Game loop using requestAnimationFrame for smoother performance
  useEffect(() => {
    if (!gameActive) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Play game over sound only once
      if (timeLeft <= 0 && !gameEndedRef.current) {
        playClip(GAME_SOUNDS.GAME_OVER);
        gameEndedRef.current = true;
      }
      return;
    }

    const gameLoop = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = (timestamp - lastTimeRef.current) / 1000; // in seconds
      lastTimeRef.current = timestamp;

      // Update timer
      setTimeLeft(prev => {
        if (prev - deltaTime <= 0) {
          setGameActive(false);
          return 0;
        }
        return prev - deltaTime;
      });

      // Add new fudge items based on probability over time
      const dropsPerSecond = 3;
      if (Math.random() < dropsPerSecond * deltaTime) {
         const newFudge: FudgeItem = {
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          y: -10,
          type: Math.random() < 0.7 ? 'fudge' : 'obstacle',
          speed: 15 + Math.random() * 25
        };
        setFudgeItems(prev => [...prev, newFudge]);
      }

      // Move fudge items based on delta time
      setFudgeItems(prev =>
        prev
          .map(item => ({ ...item, y: item.y + item.speed * deltaTime }))
          .filter(item => item.y < 110)
      );
      
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = 0;
    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameActive, playClip]);

  const GameOverScreen = () => (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 text-center animate-fade-in shadow-2xl">
        <h3 className="text-3xl font-bold text-orange-600 mb-4">Game Over!</h3>
        <p className="text-2xl mb-4">Final Score: {score}</p>
        <div className="flex gap-2 justify-center mb-4 h-8">
          {[...Array(Math.min(5, Math.floor(score / 25)))].map((_, i) => (
            <StarIcon key={i} className="text-yellow-500 fill-current" size={32} />
          ))}
          {score < 25 && <p className="text-gray-500">No stars this time. Try again!</p>}
        </div>
        <button
          onClick={startFudgeFury}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
        >
          Play Again!
        </button>
      </div>
    </div>
  );

  const StartScreen = () => (
     <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
          <h3 className="text-2xl font-bold text-orange-600 mb-4">How to Play:</h3>
          <p className="text-lg mb-4">
            Click on the falling FUDGE to score points!<br />
            Avoid clicking the falling GAVELS!
          </p>
          <button
            onClick={startFudgeFury}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
          >
            Start Game!
          </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-bold text-white drop-shadow-md">🍫 Fudge Fury</h2>
          <button
            onClick={() => setCurrentPage('menu')}
            className="bg-white hover:bg-gray-100 text-orange-600 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105"
          >
            <HomeIcon size={20} />
            Menu
          </button>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-4 flex justify-between items-center text-white backdrop-blur-sm">
          <div className="text-2xl font-bold">Score: {score}</div>
          <div className="text-2xl font-bold">Time: {Math.ceil(timeLeft)}s</div>
        </div>
        
        <div className="relative bg-[url('/wood-bg.png')] bg-cover bg-center rounded-xl h-[60vh] md:h-96 overflow-hidden shadow-lg border-4 border-yellow-800/50">
          {!gameActive && timeLeft > 0 && <StartScreen />}
          
          {gameActive && fudgeItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleFudgeClick(item)}
              className="absolute transform -translate-x-1/2 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              aria-label={item.type}
            >
               {item.type === 'fudge' 
                 ? <img src="/fudge.png" alt="fudge" className="w-12 h-12 animate-spin-slow drop-shadow-lg" />
                 : <img src="/gavel.png" alt="gavel" className="w-12 h-12 drop-shadow-lg" />
               }
            </button>
          ))}

          {!gameActive && timeLeft <= 0 && <GameOverScreen />}
        </div>
        
      </div>
    </div>
  );
};

export default FudgeFuryPage;
