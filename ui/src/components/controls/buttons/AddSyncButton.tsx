import React, { FunctionComponent } from 'react'
import {
    Fab,
    FabProps,
    Tooltip,
  } from "@material-ui/core";
  import SyncIcon from "@material-ui/icons/Sync";
  
const AddSyncButton:FunctionComponent<Omit<FabProps, "children">> = ({...props}) => {
    return (
        <div className="syncbutton">
        <Tooltip title="Sync here!" placement="top">
          <div>
          <Fab color="primary" aria-label="add sync" {...props}>
             <SyncIcon/>
          </Fab>
          </div>
        </Tooltip>
      </div>
    )
}

export default AddSyncButton
