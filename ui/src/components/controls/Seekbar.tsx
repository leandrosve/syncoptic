import React, { FunctionComponent, useEffect, useState } from "react";
import { Slider, withStyles } from "@material-ui/core";
import formatTime from "../../utils/formatVideoTime";

interface Props {
  duration: number;
  currentTime: number;
  onChange: (time: number) => void;
  step?:number;
  marks?:Iterable<number>;
}

const getValue = (value: number | Array<number>): number =>
  value instanceof Array ? value[0] : value;

const StyledSlider = withStyles(({palette}) =>({
  root:{
    marginBottom:"5px",
  },
  rail: {
    height: "10px",
  },
  track: {
    height: "10px",
  },
  thumb: {
    display:"hidden",
    height: "15px",
    width:"15px",
    bottom:"2px",
  },
  valueLabel:{
    marginLeft:"-7px",
    padding:"0px 10px",
    background:palette.primary.main,
  },
  active:{
    display:"visible"
  },
  mark: {
    height: "15px",
    background:"white",
    width: "4px",
    boxShadow:"1px 1px 2px black"
  },
  markLabel: {
    marginLeft:"2px"
  },
  markActive :{
    opacity:1,
  }
}))(Slider);


const Seekbar: FunctionComponent<Props> = ({
  duration,
  currentTime,
  onChange,
  step=0.5,
  marks=[]
}) => {
  const [time, setTime] = useState<number>(0);

  const setIsActive = useState<boolean>(false)[1];

  const onLocalChange = (value: number) => {
    setIsActive(true);
    setTime(value);
  };

  const onLocalChangeCommited = (value: number) => {
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
      marks={Array.from(marks).map((value, label) => ({value, label }))}
      value={time}
      valueLabelDisplay="auto"
      valueLabelFormat={formatTime}
      onChangeCommitted={(e, value) => onLocalChangeCommited(getValue(value))}
      onChange={(e, value) => onLocalChange(getValue(value))}
    />
  );
};

export default Seekbar;
