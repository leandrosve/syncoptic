import { Button, IconButton } from "@material-ui/core";
import React, {
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SyncIcon from "@material-ui/icons/Sync";
import Seekbar from "./Seekbar";
import formatTime from "../utils/formatVideoTime";
import SyncMap, { PointState } from "../utils/SyncMap";
import useControls from "../hooks/useControls";

interface Props {
  reactionPlayer: YT.Player | undefined;
  originalPlayer: YT.Player | undefined;
}

//const syncMap = new SyncMap([[51.4, 0], [60, PointState.PAUSED], [70, 70-51.4], [80, PointState.PAUSED],[90, 90-51.4]]);

const syncMap = new SyncMap([[170, 0], [185,0],[189,PointState.PAUSED], [235, 17.5], [252, PointState.PAUSED], [254, 24.6], [341.5, -3], [343.7, 112]]);
const Controls: FunctionComponent<Props> = ({
  reactionPlayer,
  originalPlayer,
}) => {

 

  const {isPlaying, togglePlay, currentTime, duration, reSync} = useControls(reactionPlayer, originalPlayer, syncMap);
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
        duration={duration}
        onChange={(time) => reSync(time)}
      />
      <span>{formatTime(currentTime)}</span>
    </div>
  );
};

export default Controls;
