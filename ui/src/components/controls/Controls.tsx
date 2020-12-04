import { IconButton } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from "react";
import useControls from "../../hooks/useControls";
import formatTime from "../../utils/formatVideoTime";
import SyncMap, { PointState } from "../../utils/SyncMap";
import TogglePlayButton from "./buttons/TogglePlayButton";
import Seekbar from "./Seekbar";

export interface ControlsProps {
  reactionPlayer: YT.Player | undefined;
  originalPlayer: YT.Player | undefined;
}

//const syncMap = new SyncMap([[51.4, 0], [60, PointState.PAUSED], [70, 70-51.4], [80, PointState.PAUSED],[90, 90-51.4]]);

const syncMap = new SyncMap([[170, 0], [185,0],[189,PointState.PAUSED], [235, 17.5], [252, PointState.PAUSED], [254, 24.6], [341.5, -3], [343.7, 112]]);
const Controls: FunctionComponent<ControlsProps> = ({
  reactionPlayer,
  originalPlayer,
}) => {
  
  const [timeMarker, setTimeMarker] = useState<number>(0);

  const updateTimeMark = useCallback(async() => {
      const t = await reactionPlayer?.getCurrentTime();
      setTimeMarker(t || 0);
      return t;
    }, [setTimeMarker, reactionPlayer]);
 
  const {isPlaying, togglePlay, duration, isLoading, reSync} = useControls(reactionPlayer, originalPlayer, syncMap);
  
  /** update time mark state */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reactionPlayer && isPlaying) {
      interval = setInterval(async () => {
        updateTimeMark();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [reactionPlayer, isPlaying, updateTimeMark]);
  
  return (
    <div >
      <TogglePlayButton isLoading={isLoading} isPlaying={isPlaying} togglePlay={togglePlay}/>
     
      <IconButton onClick={() => reSync()}>
        <SyncIcon />
      </IconButton>
      <Seekbar
        currentTime={timeMarker}
        duration={duration}
        onChange={(time) => reSync(time)}
      />
      <span>{formatTime(timeMarker)}</span>
    </div>
  );
};

export default Controls;
