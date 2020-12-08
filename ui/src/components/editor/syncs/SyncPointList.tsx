import {
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Typography,
} from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import React, { FunctionComponent, useCallback } from "react";
import formatTime from "../../../utils/formatVideoTime";
import SyncMap, { PointState } from "../../../utils/SyncMap";

const styles = {
  list: {
    maxHeight: "50vh",
    display: "flex",
    "flex-direction":"column-reverse",
    "overflow-y": "auto",
  },
  itemText: {
    display: "flex",
    flex: "1",
    alignItems: "center",
    justifyContent: "center",
    marginRight:"15px"
  },
  chip: {
    cursor: "pointer",
    marginRight: "5px",
  },
};
interface Props {
  syncMaps: SyncMap;
  removeSync:(reactionTime:number) => any;
  startPreview:(reactionTime:number) => any;
  onItemClick:(reactionTime:number) => any;
}
const SyncPointList: FunctionComponent<Props> = ({ syncMaps, removeSync, startPreview, onItemClick}) => {

  return (
    <List component="nav" style={styles.list}>
      {syncMaps.getAsArray().map(([key, value], index) => (
        <ListItem
          key={key}
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={()=>onItemClick(key)}
          button
        >
          <Chip
            variant="outlined"
            style={styles.chip}
            size="small"
            label={index}
          />
          <IconButton
            size="small"
            edge="start"
            onClick={() =>startPreview(key)}
          >
            <PlayArrowIcon fontSize="small" />
          </IconButton>

          <Typography variant="button" style={styles.itemText} align="center">
            {formatTime(key)} <ArrowRightAltIcon />{" "}
            {formatTime(value.time)} {value.state === PointState.PAUSED && <PauseCircleOutlineIcon />}
          </Typography>
          <ListItemSecondaryAction>
            <IconButton size="small" edge="end" aria-label="delete" onClick={()=>removeSync(key)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default SyncPointList;
