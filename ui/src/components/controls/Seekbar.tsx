import React, { FunctionComponent, useEffect, useState } from "react";
import { Slider, withStyles } from "@material-ui/core";
import formatTime from "../../utils/formatVideoTime";

interface Props {
  duration: number;
  currentTime: number;
  onChange: (time: number) => void;
  step?:number;
}

const getValue = (value: number | Array<number>): number =>
  value instanceof Array ? value[0] : value;

const StyledSlider = withStyles({
  rail: {
    height: "10px",
  },
  track: {
    height: "10px",
  },
  thumb: {
    opacity: "0",
  },
  mark: {
    height: "10px",
    background:"white",
    width: "5px",
  },
  markLabel: {
    marginLeft:"2px"
  }
})(Slider);

const marks = [
  {
    value: 0,
    label: '1',
  },
  {
    value: 20,
    label: '2',
  },
  {
    value: 37,
    label: '3',
  },
  {
    value: 50,
    label: '4',
  },
];


const Seekbar: FunctionComponent<Props> = ({
  duration,
  currentTime,
  onChange,
  step=0.5
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
      step={step}
      max={duration}
      marks={marks}
      value={time}
      valueLabelDisplay="auto"
      valueLabelFormat={formatTime}
      onChangeCommitted={(e, value) => onLocalChangeCommited(getValue(value))}
      onChange={(e, value) => onLocalChange(getValue(value))}
    />
  );
};

export default Seekbar;
