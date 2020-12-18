import { IconButton } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";
import React, {
  FunctionComponent,
} from "react";
import useWatchControls from "../../hooks/useWatchControls";
import useTimeMark from "../../hooks/useTimeMark";
import SyncMap from "../../types/SyncMap";
import TogglePlayButton from "./buttons/TogglePlayButton";
import Seekbar from "./Seekbar";
import TimeIndicator from "./TimeIndicator";

export interface ControlsProps {
  reactionPlayer: YT.Player | undefined;
  originalPlayer: YT.Player | undefined;
  syncMap:SyncMap;
  reactionId:string;
  originalId:string;
  autoPlay?:boolean;
  startAt?:number;
}

//const syncMap = new SyncMap([[51.4, 0], [60, PointState.PAUSED], [70, 70-51.4], [80, PointState.PAUSED],[90, 90-51.4]]);


const Controls: FunctionComponent<ControlsProps> = ({
  reactionPlayer,
  originalPlayer,
  syncMap,
  autoPlay,
  startAt,
  reactionId,
  originalId,
}) => {


  const { isPlaying, togglePlay, duration, isLoading, reSync } = useWatchControls(
    reactionPlayer,
    originalPlayer,
    syncMap,
    reactionId,
    originalId,
    autoPlay,
    startAt,
  );

  const timeMarker = useTimeMark(reactionPlayer, isPlaying);

  return (
    <div>
      <TogglePlayButton
        isLoading={isLoading}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
      />

      <IconButton onClick={() => reSync()}>
        <SyncIcon />
      </IconButton>
      <Seekbar
        currentTime={timeMarker}
        duration={duration}
        onChange={(time) => reSync(time)}
        marks={syncMap.getReactionTimes()}
      />
      <TimeIndicator time={timeMarker}/>
    </div>
  );
};

export default Controls;
