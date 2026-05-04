import { useEffect, useRef, useState } from 'react';
import { songsData } from '../assets/assets';
import { PlayerContext } from './PlayerContextData';

export { PlayerContext };

export default function PlayerContextProvider({ children }) {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [queue, setQueue] = useState(songsData);
  const [playStatus, setPlayStatus] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [time, setTime] = useState({ second: 0, minute: 0 });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    await setTrack(songsData[id]);
    await audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = async () => {
    if (track.id > 0) {
      await setTrack(queue[track.id - 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const next = async () => {
    if (queue.indexOf(track) < queue.length - 1) {
      await setTrack(queue[queue.indexOf(track) + 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const shuffle = (songs) => {
    for (let i = songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    return songs;
  };

  const toggleShuffle = () => {
    if (!isShuffled) {
      const rest = queue.filter((_, index) => index !== track.id);
      const shuffled = shuffle(rest);
      setQueue([track, ...shuffled]);
    } else {
      setQueue(songsData);
    }
    setIsShuffled(!isShuffled);
  };

  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
  };

  useEffect(() => {
    audioRef.current.ontimeupdate = () => {
      seekBar.current.style.width =
        Math.floor((audioRef.current.currentTime / audioRef.current.duration) * 100) + '%';

      setTime({
        second: Math.floor(audioRef.current.currentTime % 60),
        minute: Math.floor(audioRef.current.currentTime / 60),
      });
    };
  }, []);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    toggleShuffle,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
  };

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
}
