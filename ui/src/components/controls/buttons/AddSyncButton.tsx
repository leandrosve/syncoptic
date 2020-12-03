import React from 'react'
import {
    Fab,
    Tooltip,
  } from "@material-ui/core";
  import SyncIcon from "@material-ui/icons/Sync";
  
const AddSyncButton = () => {
    return (
        <div className="syncbutton">
        <Tooltip title="Sync here!" placement="top">
          <div>
          <Fab color="primary" aria-label="add sync">
             <SyncIcon/>
          </Fab>
          </div>
        </Tooltip>
      </div>
    )
}

export default AddSyncButton
