import BackupIcon from '@material-ui/icons/Backup';
import React, { FunctionComponent } from "react";
import { Fab, FabProps } from "@material-ui/core";

const UploadButton:FunctionComponent<Omit<FabProps, "children">> = (props) => {
  return (
    <Fab variant="extended" aria-label="add sync" size="small" {...props}>
      <BackupIcon/>
      Upload
    </Fab>
  );
};

export default UploadButton;
