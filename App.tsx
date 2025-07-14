
import React, { useState, useRef, useEffect } from 'react';
import { Page, PageProps, SoundClip } from './types';
import MenuPage from './components/MenuPage';
import SoundboardPage from './components/SoundboardPage';
import FudgeFuryPage from './components/FudgeFuryPage';
import DMSlidePage from './components/DMSlidePage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('menu');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [playingUntil, setPlayingUntil] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cleanup Object URL
  useEffect(() => {
    const currentAudioSrc = audioSrc;
    return () => {
      if (currentAudioSrc) {
        URL.revokeObjectURL(currentAudioSrc);
      }
    };
  }, [audioSrc]);

  const handleFileSelect = (file: File) => {
    setIsAudioReady(false);
    setAudioError(null);
    setAudioSrc(URL.createObjectURL(file));
  };
  
  const playClip = (clip: SoundClip) => {
    const audio = audioRef.current;
    if (!audio || !isAudioReady || playingUntil) return;

    const playAction = () => {
      audio.currentTime = clip.start;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback failed:", error);
          setAudioError("Could not play audio. User interaction might be required first.");
        });
      }
      setPlayingUntil(clip.end);
    }
    
    if (!audio.paused) {
        audio.pause();
        // Allow the pause event to fire before playing again
        setTimeout(playAction, 50);
    } else {
        playAction();
    }
  };
  
  // Audio playback monitor
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || playingUntil === null) return;

    const onTimeUpdate = () => {
      if (audio.currentTime >= playingUntil) {
        audio.pause();
      }
    };
    const onPause = () => setPlayingUntil(null);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('pause', onPause);
    };
  }, [playingUntil]);


  const audioControls = {
    playClip,
    isAudioReady,
    isAudioPlaying: playingUntil !== null,
  };

  const pageProps: PageProps & { handleFileSelect?: (file: File) => void; audioSrc?: string | null, audioError?: string | null } = {
    setCurrentPage,
    audioControls,
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'soundboard':
        return <SoundboardPage {...pageProps} />;
      case 'fudgeFury':
        return <FudgeFuryPage {...pageProps} />;
      case 'dmSlide':
        return <DMSlidePage {...pageProps} />;
      case 'menu':
      default:
        return <MenuPage {...pageProps} handleFileSelect={handleFileSelect} audioSrc={audioSrc} audioError={audioError} />;
    }
  };

  return (
    <div className="font-sans">
       {audioSrc && (
        <audio 
          ref={audioRef} 
          src={audioSrc} 
          preload="auto"
          onCanPlayThrough={() => setIsAudioReady(true)}
          onError={() => setAudioError("Failed to load or decode the selected audio file.")}
        ></audio>
       )}
      {renderPage()}
    </div>
  );
};

export default App;
