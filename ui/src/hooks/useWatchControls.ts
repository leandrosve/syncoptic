import { useCallback, useEffect, useState } from "react";
import PlayerState from "../enums/PlayerState";
import increasingInterval from "../utils/increasingInterval";
import SyncMap, { PointState, TimeInfo } from "../types/SyncMap";
import timeout from "../utils/timeout";
import useVideoDuration from "./useVideoDuration";

const getPlayerState = async (player: YT.Player) =>
  await player.getPlayerState().valueOf();

const isPlayerReady = async (player: YT.Player) => {
  return (await getPlayerState(player)) !== PlayerState.BUFFERING;
};

const incrementTimeout = (prev: number) => (prev < 5000 ? prev + 200 : 5000);

const useWatchControls = (
  reactionPlayer: YT.Player | undefined,
  originalPlayer: YT.Player | undefined,
  syncMap: SyncMap,
  reactionID:string,
  originalID:string,
  autoPlay?:boolean,
  startAt:number=-1,
) => {

  const {duration: reactionDuration} = useVideoDuration(reactionID, reactionPlayer)
  
  const {duration: originalDuration} = useVideoDuration(originalID, originalPlayer)


  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [nextTimeout, setNextTimeout] = useState<
    { key: number; timeout: number } | undefined
  >();

  const togglePlay = async () => {
    setIsPlaying((prev) => {
      if (prev) {
        reactionPlayer?.pauseVideo();
        originalPlayer?.pauseVideo();
        setNextTimeout(undefined);
      } else {
        reSync();
      }
      return !prev;
    });
  };


  const cleanUp = useCallback(async ()=>{

    reactionPlayer?.pauseVideo();
    originalPlayer?.pauseVideo();
  },[reactionPlayer, originalPlayer])

  const tryResumeReactionOnly = useCallback(
    async (reactionTime) => {
      if (!reactionPlayer || !originalPlayer) return true;
      await originalPlayer.pauseVideo();
      await reactionPlayer.seekTo(reactionTime, true);   
      if (await isPlayerReady(reactionPlayer)) {
        reactionPlayer.playVideo();
        setNextTimeout(syncMap.findNextTimeout(reactionTime));
        setIsLoading(false);
        return true; //exit
      }
      return false;
    },
    [originalPlayer, reactionPlayer, syncMap]
  );

  const tryResumeOnSync = useCallback(
    async (reactionTime) => {
      if (reactionTime < 0 || !reactionPlayer || !originalPlayer) return true;

      console.log("entro aca papi");
      const nextTimeout = syncMap.findNextTimeout(reactionTime);
      let secondCheck = false;
      const oneTry = async () => {
        if (
          (await isPlayerReady(reactionPlayer)) &&
          (await isPlayerReady(originalPlayer))
        ) {
          if (secondCheck) {
            console.log("second check");      
              await Promise.all([
                originalPlayer.playVideo(),
                reactionPlayer.playVideo(),
              ]);
            setNextTimeout(nextTimeout);
            setIsLoading(false);
          }
          return true;
        }
        return false;
      };
      await timeout(100);
      secondCheck = await oneTry();
      if (secondCheck) {
        await timeout(500);
        return await oneTry();
      }
      return false;
    },
    [reactionPlayer, originalPlayer, syncMap, setIsLoading]
  );

  const prepareSync = useCallback(
    async (
      reactionTime: number,
      originalPoint: TimeInfo,
      nextOriginalTime?: number
    ) => {
      if(originalPoint.time > originalDuration){
          originalPlayer?.pauseVideo();
      }

      if (reactionPlayer && originalPlayer) {
        if (originalPoint.state !== PointState.PLAYING) {
        
          await originalPlayer.pauseVideo();
          originalPlayer.seekTo(originalPoint.time, true);
          increasingInterval(
            async () => await tryResumeReactionOnly(reactionTime),
            500,
            incrementTimeout
          );
        } else {
          await reactionPlayer.pauseVideo();
          await reactionPlayer.seekTo(reactionTime, true);
          await originalPlayer.seekTo(originalPoint.time || nextOriginalTime || 0, true);    
          await originalPlayer.pauseVideo();
          await reactionPlayer.pauseVideo();
          
          increasingInterval(
            async () => await tryResumeOnSync(reactionTime),
            500,
            incrementTimeout
          );
        }
      }
    },
    [
      reactionPlayer,
      originalPlayer,
      originalDuration,
      tryResumeOnSync,
      tryResumeReactionOnly,
    ]
  );

  const reSync = useCallback(
 
    async (reactionTime?: number) => {
      setIsLoading(true);
      setNextTimeout(undefined);//cancelar el timeout previo  
        console.log({reactionTime});
      reactionTime =
        reactionTime !== undefined && reactionTime >= 0
          ? reactionTime
          : (await reactionPlayer?.getCurrentTime()) || 0;
      const originalTimePoint = syncMap.findOriginalTime(reactionTime);
      console.log({ reactionTime, originalTime: originalTimePoint});
      await prepareSync(reactionTime, originalTimePoint);
      setIsPlaying(true);
    },
    [reactionPlayer, setIsPlaying, prepareSync, syncMap, setIsLoading]
  );



  const setUp = useCallback(async () => {
    if (reactionPlayer && originalPlayer) {
      reactionPlayer?.unMute();
      originalPlayer?.unMute();
      if(startAt >= 0) {reSync(startAt)}
      else if(autoPlay) reSync();
    }
  },[reactionPlayer, originalPlayer, autoPlay, reSync, startAt]);
  /** set next timeout */
  useEffect(() => {
    if (nextTimeout) {
      const { key, timeout } = nextTimeout;
      if (timeout < 0) return;
      console.log({ nextTimeout });
      const timeoutID = setTimeout(() => {reSync(key)}, timeout * 1000 );

      return () => {
        console.log("cleared the timeout");
        clearTimeout(timeoutID);
      };
    }
  }, [nextTimeout, reSync]);

  useEffect(() => {
    if (reactionPlayer && originalPlayer) {
      setUp();
      return ()=>{cleanUp()};
    }
  }, [reactionPlayer, originalPlayer, setUp, cleanUp]);

  useEffect(()=>{
    if(originalDuration > 0 && reactionDuration> 0  && startAt >= 0) {reSync(startAt)}
  },[startAt, reSync, originalDuration, reactionDuration])
  return {
    isPlaying,
    duration: reactionDuration,
    togglePlay,
    isLoading,
    reSync,
  };
};

export default useWatchControls;
