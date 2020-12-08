import React, { FunctionComponent } from "react";
import { Fab, FabProps } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';

const SaveButton:FunctionComponent<Omit<FabProps, "children">> = (props) => {
  return (
    <Fab variant="extended" aria-label="add sync" size="small" style={{margin:"10px"}} {...props}>
      <SaveIcon />
      Save
    </Fab>
  );
};

export default SaveButton;
