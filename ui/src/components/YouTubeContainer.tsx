import React, { FunctionComponent, RefObject } from "react";
import YouTube, { Options } from "react-youtube";
const playerOptions: Options = {
  width: "100%",
  playerVars: { disablekb: 0, rel: 0, showinfo: 0 },
};

interface Props {
  videoId?: string;
  playerRef: RefObject<YouTube>;
}
const YouTubeContainer: FunctionComponent<Props> = ({ videoId, playerRef }) => {
  return (
      <div className="youtube-player-wrapper">
        <YouTube
          className="youtube-player"
          videoId={videoId}
          opts={playerOptions}
          ref={playerRef}
        />
      </div>
  );
};

export default YouTubeContainer;
