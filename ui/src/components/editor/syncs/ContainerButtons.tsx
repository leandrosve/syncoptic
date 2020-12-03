import { IconButton } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

interface Props {
  position: "left" | "right";
  expanded: boolean;
  switchExpanded: () => void;
  switchPosition: () => void;
}

const useButtonsPositionStyle = (position: string) => {
  return position === "right"
    ? { right: "inherit", left: "-30px" }
    : { right: "-30px", left: "inherit" };
};

const ContainerButtons: FunctionComponent<Props> = ({
  position,
  expanded,
  switchExpanded,
  switchPosition,
}) => {
  const styles = useButtonsPositionStyle(position);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        ...styles,
      }}
    >
      <div>
        <IconButton size="small" onClick={switchExpanded}>
          {expanded ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
        </IconButton>
      </div>
      <div>
        <IconButton size="small" onClick={switchPosition}>
          {position === "right" ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        </IconButton>
      </div>
    </div>
  );
};

export default ContainerButtons;
