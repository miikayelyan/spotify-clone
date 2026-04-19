import { useContext, useEffect } from 'react';
import './App.css';
import Display from './components/Display';
import Player from './components/Player';
import Sidebar from './components/Sidebar';
import { PlayerContext } from './context/PlayerContext';

export default function App() {
  const { audioRef, track } = useContext(PlayerContext);
  // useEffect(() => {
  //   console.log(audioRef, "audio ref after the component's render");
  // }, [audioRef]);

  return (
    <div className="h-screen bg-black">
      <div className="h-[90%] flex">
        <Sidebar />
        <Display />
      </div>
      <Player />
      <audio ref={audioRef} src={track.file} preload="auto"></audio>
    </div>
  );
}
