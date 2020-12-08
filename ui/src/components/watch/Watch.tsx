import { Grid } from "@material-ui/core";
import React, { useRef, useState } from "react";
import YouTube from "react-youtube";
import { syncMap } from "../../data/syncMaps";
import useRandomThumbnail from "../../hooks/useRandomThumbnail";
import useYoutubeVideo from "../../hooks/useYoutubeVideo";
import SwapButton from "../controls/buttons/SwapButton";
import Controls from "../controls/Controls";
import BackgroundImage from "../layout/BackgroundImage";
import YoutubeContainer from "../YouTubeContainer";

const Watch = () => {
  const [direction, setDirection] = useState<"row" | "row-reverse">("row");

  const reactionRef = useRef<YouTube>(null);

  const reactionPlayer = useYoutubeVideo(reactionRef);

  const originalRef = useRef<YouTube>(null);

  const originalPlayer = useYoutubeVideo(originalRef);

  const reactionId = "QVv2XWOttIA";
  const originalId = "XduXpTx24hY";
  const background = useRandomThumbnail(reactionId, originalId);

  const switchPositions = () => {
    setDirection((prev) => {
      if (prev === "row") return "row-reverse";
      return "row";
    });
  };

  return (
    <>
      <BackgroundImage src={background} />
      <Grid
        container
        style={{ flexDirection: direction }}
      >
        <Grid item xs={6} style={{ padding: "10px" }}>
          <h2>Reaction</h2>
          <YoutubeContainer videoId={reactionId} playerRef={reactionRef} />
        </Grid>
        <Grid item xs={6} style={{ padding: "10px" }}>
          <h2>Original</h2>
          <YoutubeContainer videoId={originalId} playerRef={originalRef} />
        </Grid>
      </Grid>
      <SwapButton onClick={switchPositions}/>
      <div style={{width:"60%"}}>
        <Controls
          reactionPlayer={reactionPlayer}
          originalPlayer={originalPlayer}
          syncMap={syncMap}
        />
      </div>
      
    </>
  );
};

export default Watch;
