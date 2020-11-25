import { useCallback, useEffect, useRef, useState } from "react";
import PlayerState from "../enums/PlayerState";
import increasingInterval from "../utils/increasingInterval";
import SyncMap, { PointState } from "../utils/SyncMap";

const getPlayerState = async (player: YT.Player) =>
  await player.getPlayerState().valueOf();

const isPlayerBuffering = async (player: YT.Player) => {
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

  /** it gets updated every second*/
  const [timeMarker, setTimeMarker] = useState<number>(0);

  const [nextTimeout, setNextTimeout] = useState<
    { key: number; timeout: number } | undefined
  >();
  const updateTimeMark = useCallback(() => {
    return (async () => {
      const t = await reactionPlayer?.getCurrentTime();
      setTimeMarker(t || 0);
      return t;
    })();
  }, [setTimeMarker, reactionPlayer]);

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
      if (!reactionPlayer || !originalPlayer) return true;
      console.log("funca??");
      await originalPlayer.pauseVideo();
      await reactionPlayer.seekTo(reactionTime, true);
      if (isPlayerBuffering(reactionPlayer)) {
        reactionPlayer.playVideo();
        setNextTimeout(syncMap.findNextTimeout(reactionTime));
        return true; //exit
      }
      return false;
    },
    [originalPlayer, reactionPlayer, syncMap]
  );

  const tryResumeOnSync = useCallback(
    async (reactionTime, originalTime) => {
      if (reactionTime >= 0 && reactionPlayer && originalPlayer) {
        if (
          isPlayerBuffering(reactionPlayer) &&
          isPlayerBuffering(originalPlayer)
        ) {
          if (originalTime >= 0) originalPlayer.playVideo();
          reactionPlayer.playVideo();
          setNextTimeout(syncMap.findNextTimeout(reactionTime));
          return true;
        }
        return false;
      }
      return true;
    },
    [reactionPlayer, originalPlayer, syncMap]
  );

  const prepareSync = useCallback(
    async (
      reactionTime: number,
      originalTime: number,
      nextOriginalTime?: number
    ) => {
      originalTime = originalTime < originalDuration ? originalTime : -1;
      if (reactionPlayer && originalPlayer) {
        if (originalTime < 0)
          increasingInterval(
            () => tryResumeReactionOnly(reactionTime),
            100,
            incrementTimeout
          );
        await originalPlayer.pauseVideo();
        await reactionPlayer.pauseVideo();
        await reactionPlayer?.seekTo(reactionTime, true);
        if (originalTime >= 0) await originalPlayer?.seekTo(originalTime, true);
        else if (originalTime === PointState.UNSTARTED)
          await originalPlayer?.seekTo(nextOriginalTime || 0, true);
        await originalPlayer.pauseVideo();
      }
      increasingInterval(
        () => tryResumeOnSync(reactionTime, originalTime),
        100,
        incrementTimeout
      );
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
      setIsPlaying(true);
      console.log({ time: reactionTime });
      reactionTime =
        reactionTime !== undefined && reactionTime >= 0
          ? reactionTime
          : (await reactionPlayer?.getCurrentTime()) || 0;
      const originalTime = syncMap.findOriginalTime(reactionTime);
      console.log({ originalTime, time: reactionTime });
      prepareSync(reactionTime, originalTime);
    },
    [reactionPlayer, setIsPlaying, prepareSync, syncMap]
  );

  /** set next timeout */
  useEffect(() => {
    if (nextTimeout) {
      const { key, timeout } = nextTimeout;
      if (timeout < 0) return;
      console.log({ nextTimeout });
      const timeoutID = setTimeout(() => reSync(key), (timeout * 1000) + 100);

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

  /** update time mark state */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reactionPlayer && isPlaying) {
      updateTimeMark();
      interval = setInterval(async () => {
        updateTimeMark();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [reactionPlayer, isPlaying, updateTimeMark]);

  return {
    isPlaying,
    currentTime: timeMarker,
    duration: reactionDuration,
    togglePlay,
    reSync,
  };
};

export default useControls;
