import { useEffect, useState } from "react";
import PlayerState from "../enums/PlayerState";

const useVideoDuration = (videoId: String, player?: YT.Player) => {
  const [duration, setDuration] = useState<number>(0);
  const [done, setDone] = useState<boolean>(false);
  
  useEffect(() => {
    if (player && videoId !== "") {
      setDone(false);
      const interval = setInterval(async () => {
        const loaded=await player.getVideoLoadedFraction(); 
        const playerState= await player.getPlayerState()?.valueOf();
      
        if (!loaded && [PlayerState.BUFFERING, PlayerState.UNSTARTED].includes(playerState)){
          await player.playVideo();
        } else {
          await player.pauseVideo();
          await player.seekTo(0, false);
          await player.pauseVideo();
          const duration = (await player.getDuration()) || -1;
          console.log(duration);
          if (duration > -1) {
            setDuration(duration);
            clearInterval(interval);
            setDone(true);
          }
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [player, setDuration, videoId]);

  return {duration, done};
};

export default useVideoDuration;
