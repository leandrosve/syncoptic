import { createStyles, Fab, makeStyles, Theme, Tooltip } from "@material-ui/core";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import React, { FunctionComponent } from "react";


interface Props{
  onClick:Function;
}

const SwapButton:FunctionComponent<Props> = ({onClick}) => {
 
  return (
    <Tooltip title="Swap!" placement="top">
    <Fab  aria-label="swap" color="primary" size="small" onClick={()=>onClick()}>
     <SwapHorizIcon/>
    </Fab>
    </Tooltip>
  );
};

export default SwapButton;
