import React from "react";
import { Fab } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';

const SaveButton = () => {
  return (
    <Fab variant="extended" aria-label="add sync" size="small" style={{margin:"10px"}}>
      <SaveIcon />
      Save
    </Fab>
  );
};

export default SaveButton;
