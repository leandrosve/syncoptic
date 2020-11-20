import { IconButton } from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SyncIcon from "@material-ui/icons/Sync";
import PlayerState from "../enums/PlayerState";
import Seekbar from "./Seekbar";
import formatTime from "../utils/formatVideoTime";
import SyncMap, { PointState } from "../utils/SyncMap";
import { setupMaster } from "cluster";
interface Props {
  reactionPlayer: YT.Player | undefined;

  originalPlayer: YT.Player | undefined;
}

const syncMap = new SyncMap([
  [51.7, 0],
  [200, -3],
]);

const Controls: FunctionComponent<Props> = ({
  reactionPlayer,
  originalPlayer,
}) => {
  const [reactionDuration, setReactionDuration] = useState<number>(0);

  const [currentTime, setCurrentTime] = useState<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const getDuration = async (player: YT.Player) => {
    setReactionDuration((await player.getDuration()) || 0);
  };

  const togglePlay = async () => {
    setIsPlaying((prev) => {
      if (prev) {
        reactionPlayer?.pauseVideo();
        originalPlayer?.pauseVideo();
      } else reSync();
      return !prev;
    });
  };

  const seekTo = async (time: number) => {
    console.log("time", formatTime(time));
    setCurrentTime(time);
    await reactionPlayer?.seekTo(time, true);
    reSync(time);
  };
  const getCurrentTime = async (player: YT.Player) => {
    const t = await player.getCurrentTime();
    setCurrentTime(t || 0);
    return t;
  };

  const resumeSync = async () => {
    if (reactionPlayer && originalPlayer) {
      let secondCheck = false;
      let intervalTimeout = 0;
      const interval = setInterval(async () => {
        intervalTimeout = intervalTimeout + 100;
        const reactionPlayerState = await reactionPlayer
          .getPlayerState()
          .valueOf();
        const originalPlayerState = await originalPlayer
          .getPlayerState()
          .valueOf();
        console.log(
          "check",
          secondCheck,
          reactionPlayerState,
          originalPlayerState
        );
        if (
          reactionPlayerState !== PlayerState.BUFFERING && originalPlayerState !== PlayerState.BUFFERING   
        ) {
          if (secondCheck) {
            console.log(
              "secondCheck",
              secondCheck,
              reactionPlayerState,
              originalPlayerState
            );
            clearInterval(interval);
            originalPlayer.playVideo();
            reactionPlayer.playVideo();
          } else secondCheck = true;
        } else secondCheck = false;
        
    }, intervalTimeout);
    }
  };
  const reSync = async (reactionTime?: number) => {
    if (reactionPlayer && originalPlayer) {
      const time = reactionTime || (await reactionPlayer.getCurrentTime());
      await reactionPlayer.pauseVideo();
      await originalPlayer.pauseVideo();
      setTimeout(async () => {
        setCurrentTime(time);
        const originalTime = syncMap.findOriginalTime(time);
        if (originalTime >= 0) {
          await originalPlayer?.seekTo(originalTime, true);
        } else if (originalTime === PointState.UNSTARTED) {
          await originalPlayer?.seekTo(syncMap.getFirstValue() || 0, true);
        }
        await originalPlayer.pauseVideo();
        const reactionPlayerState = await reactionPlayer.getPlayerState();
        const originalPlayerState = await originalPlayer.getPlayerState();
        if (time < reactionDuration) {
          if (
            originalTime >= 0 &&
            originalTime < (await originalPlayer.getDuration())
          )
            resumeSync();
          else reactionPlayer.playVideo();
        }
      }, 200);
    }
  };

  const setUp = async () => {
    if (reactionPlayer && originalPlayer) {
      getDuration(reactionPlayer);
      await reactionPlayer.playVideo();
      await reactionPlayer.pauseVideo();
      reactionPlayer?.unMute();
      await originalPlayer.playVideo();
      await originalPlayer.pauseVideo();
      originalPlayer?.unMute();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reactionPlayer && isPlaying) {
      getCurrentTime(reactionPlayer);
      interval = setInterval(async () => {
        getCurrentTime(reactionPlayer);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [reactionPlayer, isPlaying]);
  useEffect(() => {
    setUp();
  }, [reactionPlayer, originalPlayer]);

  return (
    <div>
      <IconButton onClick={togglePlay}>
        {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
      <IconButton onClick={() => reSync()}>
        <SyncIcon />
      </IconButton>
      <Seekbar
        currentTime={currentTime}
        duration={reactionDuration}
        onChange={(value) => seekTo(value)}
      />
      <span>{formatTime(currentTime)}</span>
    </div>
  );
};

export default Controls;
