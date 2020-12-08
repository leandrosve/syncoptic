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
import React, { FunctionComponent, useEffect, useState } from "react";
import SyncMap, { PointState, TimeInfo } from "../../../utils/SyncMap";
import ContainerButtons from "./ContainerButtons";
import SyncPointForm from "./SyncPointForm";
import SyncPointList from "./SyncPointList";


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

interface Props{
  syncMap:SyncMap;
  removeSync:(reactionTime:number) => any;
  startPreview:(reactionTime:number) => any;
  addSync:(reactionTime:number, originalTime:TimeInfo) => any;
}

const SyncContainer:FunctionComponent<Props> = ({syncMap, removeSync, startPreview, addSync}) => {
  const [position, setPosition] = useState<"right" | "left">("right");

  const [expanded, setExpanded] = useState<boolean>(true);

  const [openForm, setOpenForm] = useState<boolean>(true);

  const [selectedItem, setSelectedItem] = useState<[number, TimeInfo] | undefined>();

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

  const selectItem= (reactionTime:number) =>{
    setOpenForm(true);
    const timeInfo = syncMap.get(reactionTime);
    if(timeInfo)
      setSelectedItem([reactionTime, timeInfo]);
  }


  useEffect(()=>{
    setExpanded(true);
  },[syncMap, setExpanded])

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
                  <SyncPointForm addSync={addSync} defaultData={selectedItem}/>{" "}
                  <Button onClick={switchOpenForm} fullWidth>
                    <ExpandLessIcon />
                  </Button>
                </>
              )}
              <Divider />
              <SyncPointList syncMaps={syncMap} removeSync={removeSync} startPreview={startPreview} onItemClick={selectItem}/>
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

export default React.memo(SyncContainer);
