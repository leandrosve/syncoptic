import BackupIcon from "@material-ui/icons/Backup";
import React, { FunctionComponent } from "react";
import { Fab} from "@material-ui/core";

interface Props{
  onChange?:(event:React.ChangeEvent<HTMLInputElement>)=>void;
}
const UploadButton: FunctionComponent<Props> = ({onChange}) => {
  return (
    <>
      <input
        accept="application/JSON"
        id="upload-sync-button"
        style={{display:"none"}}
        type="file"
        onChange={onChange}
      />
      <label htmlFor="upload-sync-button">           
        <Fab variant="extended" aria-label="add sync" size="small"  component="span">
          <BackupIcon />
          Upload
        </Fab>
        </label>
    </>
  );
};

export default UploadButton;
