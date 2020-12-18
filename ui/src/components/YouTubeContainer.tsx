import React, { FunctionComponent, RefObject } from "react";
import YouTube, { Options } from "react-youtube";
const playerOptions: Options = {
  width: "100%",
  playerVars: { disablekb: 1, rel: 0, showinfo: 0 },
};


interface Props extends React.HTMLAttributes<HTMLDivElement>{
  videoId?: string;
  playerRef: RefObject<YouTube>;
}
const YouTubeContainer: FunctionComponent<Props> = ({ videoId, playerRef, ...props}) => {
  return (
      <div className="youtube-player-wrapper" {...props}>
        
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
