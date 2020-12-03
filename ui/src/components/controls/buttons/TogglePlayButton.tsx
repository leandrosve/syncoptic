import { CircularProgress, IconButton } from "@material-ui/core";
import React, { FunctionComponent } from "react";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

interface Props {
  isLoading?: boolean;
  togglePlay: Function;
  isPlaying: boolean;
}
const TogglePlayButton: FunctionComponent<Props> = ({
  isLoading,
  togglePlay,
  isPlaying,
}) => {
  return (
    <>
      {isLoading ? (
        <IconButton>
          {" "}
          <CircularProgress size="24" color="inherit" />
        </IconButton>
      ) : (
        <IconButton onClick={() => togglePlay()}>
          {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
      )}
    </>
  );
};

export default TogglePlayButton;
