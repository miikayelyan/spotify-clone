import { createContext, useEffect, useRef, useState } from 'react';
import { songsData } from '../assets/assets';

export const PlayerContext = createContext();

export default function PlayerContextProvider({ children }) {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);

  const [minute, second] = track.duration.split(':');

  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second, minute },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    const trackWithId = songsData[id];
    await setTrack(trackWithId);
    await audioRef.current.play();
    setPlayStatus(true);
    setTime({
      ...time,
      totalTime: {
        second: trackWithId.duration.split(':')[1],
        minute: trackWithId.duration.split(':')[0],
      },
    });
  };

  const previous = async () => {
    if (track.id > 0) {
      const prevTrack = songsData[track.id - 1];
      await setTrack(prevTrack);
      await audioRef.current.play();
      setPlayStatus(true);
      setTime({
        ...time,
        totalTime: {
          second: prevTrack.duration.split(':')[1],
          minute: prevTrack.duration.split(':')[0],
        },
      });
    }
  };

  const next = async () => {
    if (track.id < songsData.length - 1) {
      const nextTrack = songsData[track.id + 1];
      await setTrack(nextTrack);
      await audioRef.current.play();
      setPlayStatus(true);
      setTime({
        ...time,
        totalTime: {
          second: nextTrack.duration.split(':')[1],
          minute: nextTrack.duration.split(':')[0],
        },
      });
    }
  };

  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
  };

  useEffect(() => {
    audioRef.current.ontimeupdate = () => {
      seekBar.current.style.width =
        Math.floor((audioRef.current.currentTime / audioRef.current.duration) * 100) + '%';

      setTime((prev) => ({
        ...prev,
        currentTime: {
          second: Math.floor(audioRef.current.currentTime % 60),
          minute: Math.floor(audioRef.current.currentTime / 60),
        },
      }));
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
