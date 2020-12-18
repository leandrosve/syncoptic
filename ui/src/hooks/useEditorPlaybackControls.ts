import { useCallback, useState } from "react";
import useTimeMark from "./useTimeMark";
import useVideoDuration from "./useVideoDuration";
const useEditorPlaybackControls = (
  player: YT.Player | undefined,
  videoId: string
) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [previousTime, setPreviousTime] = useState<number>(0);

  const {duration}=  useVideoDuration(videoId, player);

  const timeMark = useTimeMark(player, isPlaying, previousTime);

  const seekTo = useCallback(
    async (time: number) => {
      await player?.seekTo(time, true);
      if (!isPlaying) player?.pauseVideo();
      setPreviousTime(time);
    },
    [player, isPlaying]
  );

  const stepBackwards = useCallback(async () => {
    await player?.pauseVideo();
    setIsPlaying(false);
    await seekTo(previousTime);
  }, [player, setIsPlaying, seekTo, previousTime]);

  const pause = useCallback(async () => {
    if (!player) return;
    else {
      await player.pauseVideo();
      setPreviousTime((await player.getCurrentTime()) || 0);
    }
  }, [player]);

  const togglePlay = useCallback(async () => {
    setIsPlaying((prev) => {
      if (!prev) player?.playVideo();
      else pause();
      return !prev;
    });
  }, [setIsPlaying, player, pause]);

  const rewind = useCallback(async () => {
    if(player)
      seekTo(await player.getCurrentTime() - 0.1);
  }, [seekTo, player]);

  const forward = useCallback(async () => {
    if(player)
    seekTo(await player.getCurrentTime() + 0.1);
  }, [seekTo, player]);

  

  return {
    isPlaying,
    duration,
    timeMark,
    seekTo,
    stepBackwards,
    pause,
    togglePlay,
    rewind,
    forward,
  };
};

export default useEditorPlaybackControls;
