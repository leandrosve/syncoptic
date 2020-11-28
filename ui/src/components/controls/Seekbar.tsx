import React, { FunctionComponent, useEffect, useState } from "react";
import { Slider, withStyles } from "@material-ui/core";
import formatTime from "../../utils/formatVideoTime";

interface Props {
  duration: number;
  currentTime: number;
  onChange: (time: number) => void;
}

const getValue = (value: number | Array<number>): number =>
  value instanceof Array ? value[0] : value;

  const StyledSlider = withStyles({
    rail: {
      height: "10px"
    },
    track: {
      height: "10px"
    },
    thumb: {
      opacity:"0",
    },
  })(Slider);
const Seekbar: FunctionComponent<Props> = ({
  duration,
  currentTime,
  onChange,
}) => {
  const [time, setTime] = useState<number>(0);

  const setIsActive = useState<boolean>(false)[1];

  const onLocalChange = (value: number) => {
    setIsActive(true);
    setTime(value);
  };

  const onLocalChangeCommited = (value: number) => {
    console.log("===============================");
    console.log("value", value);
    onChange(getValue(value));
    setTimeout(() => setIsActive(false), 300);
  };
  useEffect(() => {
    setIsActive((prev) => {
      if (!prev) setTime(currentTime);
      return prev;
    });
  }, [currentTime, setIsActive]);

  return (
    <StyledSlider
      step={0.5}
      max={duration}
      value={time}
      valueLabelDisplay="auto"
      valueLabelFormat={formatTime}
      onChangeCommitted={(e, value) => onLocalChangeCommited(getValue(value))}
      onChange={(e, value) => onLocalChange(getValue(value))}
    />
  );
};

export default Seekbar;
