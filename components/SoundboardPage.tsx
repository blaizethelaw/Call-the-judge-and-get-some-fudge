import React, { useState } from 'react';
import { PageProps, SoundboardItem } from '../types';
import { SOUNDBOARD_ITEMS } from '../constants';
import HomeIcon from './icons/HomeIcon';

const SoundboardPage: React.FC<PageProps> = ({ setCurrentPage, audioControls }) => {
  const { playClip, isAudioPlaying, isAudioReady } = audioControls;
  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);

  const handleSoundClick = (item: SoundboardItem) => {
    playClip(item);
    setActiveButtonId(item.id);
  };
  
  // A small effect to clear the active button when audio stops
  React.useEffect(() => {
    if (!isAudioPlaying) {
      setActiveButtonId(null);
    }
  }, [isAudioPlaying]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-white">🎵 Soundboard</h2>
          <button
            onClick={() => setCurrentPage('menu')}
            className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105"
          >
            <HomeIcon size={20} />
            Menu
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SOUNDBOARD_ITEMS.map(item => (
            <button
              key={item.id}
              id={`sound-${item.id}`}
              onClick={() => handleSoundClick(item)}
              disabled={!isAudioReady || isAudioPlaying}
              className={`${item.speaker === 'The Fudge Judge' ? 'bg-purple-500' : 'bg-blue-500'} text-white font-bold p-4 rounded-xl text-lg transform transition-all duration-200 shadow-lg h-32 flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:opacity-90 ${activeButtonId === item.id ? 'scale-110 ring-4 ring-white' : 'enabled:hover:scale-105'}`}
            >
              <span className="text-center flex-grow flex items-center">{item.text}</span>
              <span className="text-xs font-normal opacity-80 mt-auto">{item.speaker}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-8 bg-white bg-opacity-20 rounded-xl p-6 text-white backdrop-blur-sm">
          {isAudioPlaying && <p className="text-center text-lg animate-pulse">🎤 Playing...</p>}
          {!isAudioPlaying && <p className="text-center text-lg">🎤 Tap any button to play iconic sound clips!</p>}
        </div>
      </div>
    </div>
  );
};

export default SoundboardPage;
