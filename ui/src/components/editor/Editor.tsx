import { Backdrop, Grid} from "@material-ui/core";
import YouTubeContainer from "../YouTubeContainer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import PlaybackControls from "../controls/PlaybackControls";
import AddSyncButton from "../controls/buttons/AddSyncButton";
import SaveButton from "../controls/buttons/SaveButton";
import useRandomThumbnail from "../../hooks/useRandomThumbnail";
import PreviewButton from "../controls/buttons/PreviewButton";
import SyncContainer from "./syncs/SyncContainer";
import useYoutubeVideo from "../../hooks/useYoutubeVideo";
import PreviewControls from "./PreviewControls";
import SyncMap, { PointState, TimeInfo } from "../../types/SyncMap";
import UploadButton from "../controls/buttons/UploadButton";
import useEditorPlaybackControls from "../../hooks/useEditorPlaybackControls";
import exportToJson from "../../utils/exportToJson";
import extractVideoIDFromURL from "../../utils/extractVideoIDFromURL";
import URLInput from "./URLInput";
import readJsonFile from "../../utils/readJsonFile";
import SyncData from "../../types/SyncData";

const Editor = () => {
  const reactionRef = useRef<YouTube>(null);
  const originalRef = useRef<YouTube>(null);
  const [reactionId, setReactionId] = useState<string>("s8RIyo6Jwcgs");
  const [originalId, setOriginalId] = useState<string>("mY_oDyqRM1As");

  const background = useRandomThumbnail(reactionId, originalId);

  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false);

  const [previewStartTime, setPreviewStartTime] = useState<number>(-1);


  const reactionPlayer = useYoutubeVideo(reactionRef);
  const originalPlayer = useYoutubeVideo(originalRef);

  const zIndex = isPreviewActive ? 1501 : "inherit";

  const [syncMap, setSyncMap] = useState<SyncMap>(new SyncMap());

  const {timeMark:reactionTimeMark, ...reactionPlaybackProps} = useEditorPlaybackControls(reactionPlayer, reactionId);

  const {timeMark:originalTimeMark, ...originalPlaybackProps} = useEditorPlaybackControls(originalPlayer, originalId);

  const addSync = useCallback(
    async (reactionTime?: number, originalTimeInfo?: TimeInfo) => {
      reactionTime =
        reactionTime == null
          ? reactionTimeMark || 0
          : reactionTime;
      const originalTime= originalTimeInfo
        ? originalTimeInfo.time
        : originalTimeMark || 0;
      if (reactionTime !== null && originalTimeInfo !== null)
        setSyncMap(
          (prev) =>
            new SyncMap(
              prev.addSyncPoint(reactionTime || 0, {
                time: originalTime,
                state: originalTimeInfo?.state || PointState.PLAYING,
              })
            )
        );
    },
    [setSyncMap, originalTimeMark, reactionTimeMark]
  );

  const removeSync = useCallback(
    async (reactionTime: number) => {
      setSyncMap((prev) => {
        const next = new SyncMap(prev);
        next.delete(reactionTime);
        return next;
      });
    },
    [setSyncMap]
  );

  const startPreview = useCallback(
    async (time?: number) => {
      console.log({startpreview:time})
      //await reactionPlaybackProps.seekTo(time || 0);
      setPreviewStartTime(prev => {
        if(time === prev) {setIsPreviewActive(true); return prev} else return time || 0});
     // setIsPreviewActive(true);
    },
    [setIsPreviewActive, setPreviewStartTime]
  );

  const handleSave = () => {
    const jsonData = {
      reactionId: reactionId,
      originalId: originalId,
      syncMap: [...syncMap],
    };
    exportToJson(jsonData);
  };

  const handleReactionIDChange = useCallback((e)=>{
    const id = extractVideoIDFromURL(e.target.value);
    if(id) setReactionId(id);
  },[setReactionId])

  const handleOriginalIDChange = useCallback((e)=>{
    const id = extractVideoIDFromURL(e.target.value);
    if(id) setOriginalId(id);
  },[setOriginalId])

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
    if(previewStartTime >= 0){
      setIsPreviewActive(true);
    }
  },[previewStartTime])

  return (
    <>
      <div
        className="background"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <Grid container alignItems="stretch">
        <Grid item xs={6} style={{ padding: "10px" }}>
          <h2>Reaction</h2>
          <URLInput onChange={handleReactionIDChange} defaultValue={"https://www.youtube.com/watch?v="+reactionId}/>
          <YouTubeContainer
            videoId={reactionId}
            playerRef={reactionRef}
            style={{ zIndex }}
          />
        </Grid>
        <Grid item xs={6} style={{ padding: "10px" }}>
          <h2>Original</h2>
          <URLInput onChange={handleOriginalIDChange} defaultValue={"https://www.youtube.com/watch?v="+originalId}/>
          <YouTubeContainer
            videoId={originalId}
            playerRef={originalRef}
            style={{ zIndex }}
          />
        </Grid>
        <Grid item xs={12}>
          {isPreviewActive && (
            <PreviewControls
              reactionPlayer={reactionPlayer}
              originalPlayer={originalPlayer}
              syncMap={syncMap}
              originalId={originalId}
              reactionId={reactionId}
              startAt={previewStartTime}
            />
          )}
        </Grid>
        <Grid item xs={6} style={{ padding: "0px 10px" }}>
          {!!reactionPlayer && (
            <PlaybackControls
              marks={syncMap.getReactionTimes()}
              timeMark={reactionTimeMark}
              {...reactionPlaybackProps}
            />
          )}
        </Grid>
        {!!originalPlayer && (
          <Grid item xs={6} style={{ padding: "0px 10px" }}>
            <PlaybackControls
            timeMark={originalTimeMark}
              marks={syncMap.getOriginalTimes()}
              {...originalPlaybackProps}

            />
          </Grid>
        )}
      </Grid>

      <AddSyncButton onClick={() => addSync()} />

      <div
        className="flexHorizontal"
        style={{ marginTop: "10px", position: "relative" }}
      >
        <UploadButton onChange={handleUpload}/>
        <SaveButton onClick={handleSave} />
        <PreviewButton onClick={startPreview} />
      </div>
      <SyncContainer
        syncMap={syncMap}
        removeSync={removeSync}
        startPreview={startPreview}
        addSync={addSync}
      />

      <Backdrop
        open={isPreviewActive}
        style={{ zIndex: 1500, backgroundColor: "#000000cc" }}
        onClick={() => setIsPreviewActive(false)}
      />
    </>
  );
};

export default Editor;
