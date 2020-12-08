import { useCallback, useEffect, useState } from "react";
import PlayerState from "../enums/PlayerState";
import increasingInterval from "../utils/increasingInterval";
import SyncMap, { PointState, TimeInfo } from "../utils/SyncMap";
import timeout from "../utils/timeout";

const getPlayerState = async (player: YT.Player) =>
  await player.getPlayerState().valueOf();

const isPlayerReady = async (player: YT.Player) => {
  return (await getPlayerState(player)) !== PlayerState.BUFFERING;
};

const incrementTimeout = (prev: number) => (prev < 5000 ? prev + 200 : 5000);

const useControls = (
  reactionPlayer: YT.Player | undefined,
  originalPlayer: YT.Player | undefined,
  syncMap: SyncMap,
  autoPlay?:boolean,
) => {
  const [reactionDuration, setReactionDuration] = useState<number>(0);

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
      console.log("tryresumereactiononly");
      if (!reactionPlayer || !originalPlayer) return true;
      console.log("funca??");
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

        console.log("falseee");
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
      originalTime: TimeInfo,
      nextOriginalTime?: number
    ) => {
      await originalPlayer?.pauseVideo();

      if (reactionPlayer && originalPlayer) {
        if (originalTime.state !== PointState.PLAYING) {
        
          await originalPlayer.pauseVideo();
          originalPlayer.seekTo(originalTime.time, true);
          increasingInterval(
            async () => await tryResumeReactionOnly(reactionTime),
            500,
            incrementTimeout
          );
        } else {
          await originalPlayer.pauseVideo();
          await reactionPlayer.pauseVideo();
          await reactionPlayer.seekTo(reactionTime, true);
          await originalPlayer.seekTo(originalTime.time || nextOriginalTime || 0, true);     
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
      tryResumeOnSync,
      tryResumeReactionOnly,
    ]
  );

  const reSync = useCallback(
 
    async (reactionTime?: number) => {
      setIsLoading(true);
      setNextTimeout(undefined);//cancelar el timeout previo  
      console.log({ time: reactionTime });
     // await reactionPlayer?.pauseVideo();
      reactionTime =
        reactionTime !== undefined && reactionTime >= 0
          ? reactionTime
          : (await reactionPlayer?.getCurrentTime()) || 0;
      const originalTime = syncMap.findOriginalTime(reactionTime);
      console.log({ originalTime, time: reactionTime });
      await prepareSync(reactionTime, originalTime);
      setIsPlaying(true);
    },
    [reactionPlayer, setIsPlaying, prepareSync, syncMap, setIsLoading]
  );



  const setUp = useCallback(async () => {
    if (reactionPlayer && originalPlayer) {
      setReactionDuration(await reactionPlayer.getDuration());
      reactionPlayer?.unMute();
      originalPlayer?.unMute();
      if(autoPlay) reSync();
    }
  },[setReactionDuration, reactionPlayer, originalPlayer, autoPlay, reSync]);
  /** set next timeout */
  useEffect(() => {
    if (nextTimeout) {
      const { key, timeout } = nextTimeout;
      if (timeout < 0) return;
      console.log({ nextTimeout });
      const timeoutID = setTimeout(() => reSync(key), timeout * 1000 );

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

  return {
    isPlaying,
    duration: reactionDuration,
    togglePlay,
    isLoading,
    reSync,
  };
};

export default useControls;
