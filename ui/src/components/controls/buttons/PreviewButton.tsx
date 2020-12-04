import React from "react";
import { Fab } from "@material-ui/core";
import MovieCreationIcon from "@material-ui/icons/MovieCreation";

const PreviewButton = ({onClick}:{onClick:Function}) => {
  return (
    <Fab variant="extended" aria-label="add sync" size="small" onClick={()=>onClick()}>
      <MovieCreationIcon />
      Preview
    </Fab>
  );
};

export default PreviewButton;
