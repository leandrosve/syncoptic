import { FilledInput, Grid, InputAdornment } from "@material-ui/core";
import YouTubeContainer from "../YouTubeContainer";
import React, { useRef, useState } from "react";
import YouTube from "react-youtube";
import PlaybackControls from "../controls/PlaybackControls";
import AddSyncButton from "../controls/buttons/AddSyncButton";
import SaveButton from "../controls/buttons/SaveButton";
import YouTubeIcon from "@material-ui/icons/YouTube";
import useRandomThumbnail from "../../hooks/useRandomThumbnail";
import PreviewButton from "../controls/buttons/PreviewButton";
import SyncContainer from "./syncs/SyncContainer";

const UrlInput = () => (
  <FilledInput
    fullWidth
    color="primary"
    inputProps={{ style: { padding: "15px" }, maxlength: "100" }}
    startAdornment={
      <InputAdornment position="start">
        <YouTubeIcon style={{ color: "red" }} />
        <strong>URL</strong>
      </InputAdornment>
    }
  />
);
const Editor = () => {
  const reactionRef = useRef<YouTube>(null);
  const originalRef = useRef<YouTube>(null);
  const [reactionId] = useState<string>("v6fVIkqG6pg");
  const [originalId] = useState<string>("sn_HqE5wDYE");
  const background = useRandomThumbnail(reactionId, originalId);

  return (
    <>
      <div
        className="background"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <Grid container alignItems="stretch">
        <Grid item xs={6} style={{ padding: "10px" }}>
          <h2>Reaction</h2>
          <UrlInput />
          <YouTubeContainer videoId={reactionId} playerRef={reactionRef} />
          <PlaybackControls />
        </Grid>

        <Grid item xs={6} style={{ padding: "10px" }}>
          <h2>Original</h2>
          <UrlInput />
          <YouTubeContainer videoId={originalId} playerRef={originalRef} />
          <PlaybackControls />
        </Grid>
      </Grid>
      <AddSyncButton />
      <div className="flexHorizontal" style={{ marginTop: "10px" }}>
        <SaveButton />
        <PreviewButton />
      </div>

      <SyncContainer />
    </>
  );
};

export default Editor;
