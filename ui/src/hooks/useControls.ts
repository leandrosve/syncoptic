import { useCallback, useEffect, useState } from "react";
import PlayerState from "../enums/PlayerState";
import increasingInterval from "../utils/increasingInterval";
import SyncMap from "../utils/SyncMap";
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
  syncMap: SyncMap
) => {
  const [reactionDuration, setReactionDuration] = useState<number>(0);
  const [originalDuration, setOriginalDuration] = useState<number>(0);

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

  const setUp = async (
    setReactionDuration: (val: number) => void,
    setOriginalDuration: (val: number) => void,
    reactionPlayer?: YT.Player,
    originalPlayer?: YT.Player
  ) => {
    if (reactionPlayer && originalPlayer) {
      setReactionDuration(await reactionPlayer.getDuration());
      setOriginalDuration(await originalPlayer.getDuration());
      await reactionPlayer.seekTo(0.2, true);
      reactionPlayer?.unMute();
      await originalPlayer.seekTo(0.2, true);
      originalPlayer?.unMute();
    }
  };

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
            setNextTimeout(syncMap.findNextTimeout(reactionTime));
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
      originalTime: number,
      nextOriginalTime?: number
    ) => {
      await originalPlayer?.pauseVideo();
      originalTime = originalTime < originalDuration ? originalTime : -1;
      console.log(originalTime);
      if (reactionPlayer && originalPlayer) {
        if (originalTime < 0) {
          originalPlayer.pauseVideo();
          increasingInterval(
            async () => await tryResumeReactionOnly(reactionTime),
            500,
            incrementTimeout
          );
        } else {
          await originalPlayer.pauseVideo();
          await reactionPlayer.pauseVideo();
          await reactionPlayer.seekTo(reactionTime, true);
          await originalPlayer.seekTo(originalTime || nextOriginalTime || 0, true);     
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
      originalDuration,
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
      await reactionPlayer?.pauseVideo();
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

  /** set next timeout */
  useEffect(() => {
    if (nextTimeout) {
      const { key, timeout } = nextTimeout;
      if (timeout < 0) return;
      console.log({ nextTimeout });
      const timeoutID = setTimeout(() => reSync(key), timeout * 1000);

      return () => {
        console.log("cleared the timeout");
        clearTimeout(timeoutID);
      };
    }
  }, [nextTimeout, reSync]);

  useEffect(() => {
    if (reactionPlayer && originalPlayer) {
      setUp(
        setReactionDuration,
        setOriginalDuration,
        reactionPlayer,
        originalPlayer
      );
    }
  }, [reactionPlayer, originalPlayer]);

  return {
    isPlaying,
    duration: reactionDuration,
    togglePlay,
    isLoading,
    reSync,
  };
};

export default useControls;
