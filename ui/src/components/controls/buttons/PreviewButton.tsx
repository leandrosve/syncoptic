import React from "react";
import { Fab } from "@material-ui/core";
import MovieCreationIcon from "@material-ui/icons/MovieCreation";

const PreviewButton = () => {
  return (
    <Fab variant="extended" aria-label="add sync" size="small">
      <MovieCreationIcon />
      Preview
    </Fab>
  );
};

export default PreviewButton;
