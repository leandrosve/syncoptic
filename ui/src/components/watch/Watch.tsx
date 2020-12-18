import { Grid } from "@material-ui/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { syncMap as defaultSyncMap} from "../../data/syncMaps";
import useRandomThumbnail from "../../hooks/useRandomThumbnail";
import useYoutubeVideo from "../../hooks/useYoutubeVideo";
import readJsonFile from "../../utils/readJsonFile";
import SyncData from "../../types/SyncData";
import SwapButton from "../controls/buttons/SwapButton";
import UploadButton from "../controls/buttons/UploadButton";
import Controls from "../controls/Controls";
import BackgroundImage from "../layout/BackgroundImage";
import YoutubeContainer from "../YouTubeContainer";
import SyncMap from "../../types/SyncMap";

const Watch = () => {
  const [direction, setDirection] = useState<"row" | "row-reverse">("row");

  const reactionRef = useRef<YouTube>(null);

  const reactionPlayer = useYoutubeVideo(reactionRef);

  const originalRef = useRef<YouTube>(null);

  const originalPlayer = useYoutubeVideo(originalRef);

  const [reactionId, setReactionId] = useState<string>("QVv2XWOttIA");

  const [originalId, setOriginalId] = useState<string>("XduXpTx24hY");

  const [syncMap, setSyncMap] = useState(new SyncMap(defaultSyncMap));

  const background = useRandomThumbnail(reactionId, originalId);

  const switchPositions = () => {
    setDirection((prev) => {
      if (prev === "row") return "row-reverse";
      return "row";
    });
  };

  const handleUpload = useCallback(async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if(file){
      const result =(await readJsonFile(file)) as SyncData;
      console.log(result.syncMap);
      if(result === null || Object.keys(result).length === 0){
        alert("something went wrong with the uploaded sync file.");
      }
      if(result.reactionId) setReactionId(result.reactionId);
      if(result.originalId) setOriginalId(result.originalId);
      if(result.syncMap) setSyncMap(new SyncMap(result.syncMap));
      
    } 
  },[setReactionId, setOriginalId])

  useEffect(()=>{
    console.log(syncMap)
  },[syncMap])
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
          reactionId={reactionId}
          originalId={originalId}
          originalPlayer={originalPlayer}
          syncMap={syncMap}
        />
        <UploadButton onChange={handleUpload}/>
      </div>
      
    </>
  );
};

export default Watch;
