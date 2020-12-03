import PushpinOutlined from "@ant-design/icons/PushpinOutlined";
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Typography,
  withStyles
} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import React, { useState } from "react";
import { PointState } from "../../../utils/SyncMap";
import ContainerButtons from "./ContainerButtons";
import SyncPointForm from "./SyncPointForm";
import SyncPointList from "./SyncPointList";

const syncPoints = [
  [170, 0],
  [185, 0],
  [189, PointState.PAUSED],
  [235, 17.5],
  [252, PointState.PAUSED],
  [254, 24.6],
  [341.5, -3],
  [343.7, 112],
];

const StyledPaper = withStyles(({ palette }) => ({
  root: {
    //for transparency
    backgroundColor: palette.background.paper + "f1",
    padding: "10px",
    width: "400px",
    minHeight: "60px",
    textAlign: "left",
  },
}))(Paper);

const SyncContainer = () => {
  const [position, setPosition] = useState<"right" | "left">("right");

  const [expanded, setExpanded] = useState<boolean>(true);

  const [openForm, setOpenForm] = useState<boolean>(true);

  const switchPosition = () => {
    setPosition((prev) => (prev === "right" ? "left" : "right"));
  };

  const switchOpenForm = () => {
    setOpenForm((prev) => !prev);
    setExpanded(true);
  };

  const switchExpanded = () => {
    setExpanded((prev) => {
      if (prev) setOpenForm(false);
      return !prev;
    });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: position }}
      open={true}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          flexDirection: position === "right" ? "row" : "row-reverse",
        }}
      >
        <StyledPaper>
          <Typography variant="h6">
            <div
              className="flexHorizontal"
              style={{ justifyContent: "space-between" }}
            >
              <span>
                Sync. Points <PushpinOutlined />
              </span>

              {!openForm && (
                <IconButton onClick={switchOpenForm}>
                  <Add />
                </IconButton>
              )}
            </div>
          </Typography>

          <Divider />
          {expanded && (
            <>
              {openForm && (
                <>
                  <SyncPointForm />{" "}
                  <Button onClick={switchOpenForm} fullWidth>
                    <ExpandLessIcon />
                  </Button>
                </>
              )}
              <Divider />
              <SyncPointList syncPoints={syncPoints}/>
            </>
          )}
        </StyledPaper>
        <ContainerButtons
          position={position}
          expanded={expanded}
          switchExpanded={switchExpanded}
          switchPosition={switchPosition}
        />
      </div>
    </Snackbar>
  );
};

export default SyncContainer;
