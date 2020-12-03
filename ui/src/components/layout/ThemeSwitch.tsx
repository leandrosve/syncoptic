import { withStyles } from "@material-ui/core";
import { grey, yellow } from "@material-ui/core/colors";
import Switch from "@material-ui/core/Switch";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import BrightnessHigh from "@material-ui/icons/BrightnessHigh";
import React, { FunctionComponent } from "react";

const StyledSwitch = withStyles({
  switchBase: {
    fill: grey[800],
    stroke: grey[800],
    strokeWidth: "2",
    color: yellow[700],
    track: { backgroundColor: grey[300] },
    "&$checked": {
      color: "#5b44f2",
      stroke: "black",
    },
    "&$checked + $track": {
      backgroundColor: grey[700],
    },
  },
  checked: {},
  track: { marginTop: "2px" },
})(Switch);

interface Props{
  theme:string,
  switchTheme:Function
}

const ThemeSwitch: FunctionComponent<Props> = ({theme, switchTheme}) => {


  return (
    <StyledSwitch
      color="default"
      checked={theme === "dark"}
      onChange={()=>switchTheme()}
      checkedIcon={<Brightness2Icon />}
      icon={<BrightnessHigh />}
    />
  );
};

export default ThemeSwitch;
