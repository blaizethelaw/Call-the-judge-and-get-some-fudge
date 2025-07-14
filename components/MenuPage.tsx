
import React, { useRef } from 'react';
import { Page, AudioControls } from '../types';
import Volume2Icon from './icons/Volume2Icon';
import GavelIcon from './icons/GavelIcon';
import MessageSquareIcon from './icons/MessageSquareIcon';
import UploadCloudIcon from './icons/UploadCloudIcon';

interface MenuPageProps {
  setCurrentPage: (page: Page) => void;
  handleFileSelect: (file: File) => void;
  audioSrc: string | null;
  audioControls: AudioControls;
  audioError: string | null;
}

const FileUploadPrompt: React.FC<{ onFileSelect: (file: File) => void, error: string | null, isLoading: boolean }> = ({ onFileSelect, error, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mt-8 text-center bg-white/10 backdrop-blur-sm p-8 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-white/30">
        <UploadCloudIcon size={64} className="text-white/70 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Activate App Sounds</h3>
        <p className="text-white/80 mb-6">Upload the Fudge Judge audio file (MP3) to enable all sound features.</p>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".mp3" className="hidden" />
        <button
            onClick={handleButtonClick}
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
        >
            Select Audio File
        </button>
        {isLoading && <p className="text-white/80 mt-4 animate-pulse">Loading audio...</p>}
        {error && <p className="text-red-300 mt-4">{error}</p>}
    </div>
  );
};


const MenuPage: React.FC<MenuPageProps> = ({ setCurrentPage, handleFileSelect, audioSrc, audioControls, audioError }) => {
  const { isAudioReady } = audioControls;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-8 flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold mb-4 animate-bounce">🍫 Fudge Judge 🍫</h1>
      <p className="text-xl mb-8">Based on the viral sensation!</p>
      
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => setCurrentPage('soundboard')}
          disabled={!isAudioReady}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-6 px-8 rounded-xl text-xl transform transition-all duration-200 shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:scale-105"
        >
          <Volume2Icon size={28} />
          Soundboard
        </button>
        
        <button
          onClick={() => setCurrentPage('fudgeFury')}
           disabled={!isAudioReady}
          className="w-full bg-pink-400 hover:bg-pink-500 text-purple-900 font-bold py-6 px-8 rounded-xl text-xl transform transition-all duration-200 shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:scale-105"
        >
          <GavelIcon size={28} />
          Fudge Fury Game
        </button>
        
        <button
          onClick={() => setCurrentPage('dmSlide')}
           disabled={!isAudioReady}
          className="w-full bg-blue-400 hover:bg-blue-500 text-purple-900 font-bold py-6 px-8 rounded-xl text-xl transform transition-all duration-200 shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:scale-105"
        >
          <MessageSquareIcon size={28} />
          DM Slide
        </button>
      </div>

      {!audioSrc && <FileUploadPrompt onFileSelect={handleFileSelect} error={audioError} isLoading={!!audioSrc && !isAudioReady} />}
    </div>
  );
};

export default MenuPage;
