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
import React, { FunctionComponent } from "react";
import formatTime from "../../../utils/formatVideoTime";

const styles = {
  list: {
    maxHeight: "50vh",
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
  syncPoints: number[][];
}
const SyncPointList: FunctionComponent<Props> = ({ syncPoints }) => {
  return (
    <List component="nav" style={styles.list}>
      {syncPoints.map(([key, value], index) => (
        <ListItem
          key={key}
          aria-haspopup="true"
          aria-controls="lock-menu"
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
            onClick={(e) => e.stopPropagation()}
          >
            <PlayArrowIcon fontSize="small" />
          </IconButton>

          <Typography variant="button" style={styles.itemText} align="center">
            {formatTime(key)} <ArrowRightAltIcon />{" "}
            {value < 0 ? <PauseCircleOutlineIcon /> : formatTime(value)}
          </Typography>
          <ListItemSecondaryAction>
            <IconButton size="small" edge="end" aria-label="delete">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default SyncPointList;
