import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  InputAdornment,
  InputProps,
} from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import NumberFormat from "react-number-format";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import formatTimeInput, { parseToNumber } from "../../../utils/formatTimeInput";
import formatTime from "../../../utils/formatVideoTime"; 
import { PointState, TimeInfo } from "../../../utils/SyncMap";
import { syncMap } from "../../../data/syncMaps";

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, ...other } = props;

  return (
    <NumberFormat
      {...other}
      placeholder="mm:ss:mss"
      getInputRef={inputRef}
      format={formatTimeInput}
    />
  );
}


interface TimeInputProps extends InputProps{
  label:String;
}

const TimeInput:FunctionComponent<TimeInputProps> = ({ label, ...props}) => (
  <div>
    {label}
    <Input
      color="primary"
      inputComponent={NumberFormatCustom as any}
      startAdornment={
        <InputAdornment position="start">
          <AccessTimeIcon />
        </InputAdornment>
      }
      {...props}
    />
  </div>
);

interface Props{
  addSync:(reactionTime:number, originalTime:TimeInfo) => any;
  defaultReactionTime?:number;
  defaultData?:[number, TimeInfo];
}

const SyncPointForm:FunctionComponent<Props> = ({defaultReactionTime, defaultData, addSync}) => {
  const [reactionTime, setReactionTime] = useState<string>("");

  const [originalTime, setOriginalTime] = useState<string>("");

  const [isOriginalPaused, setIsOriginalPaused] = useState<boolean>(false);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);


  const handleReactionTimeChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setReactionTime(e.target.value);
  }

  const handleOriginalTimeChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setOriginalTime(e.target.value);
  }

  const handleIsOriginalPausedChange = (e: React.ChangeEvent<HTMLInputElement>, checked:boolean)=>{
    setIsOriginalPaused(checked);
  }

  const handleSubmit = () =>{
    const point = {time:parseToNumber(originalTime), state:isOriginalPaused? PointState.PAUSED : PointState.PLAYING};
    addSync(parseToNumber(reactionTime), point);
  }


  useEffect(()=>{
    if(reactionTime && originalTime){
      setDisableSubmit(false);
    }else setDisableSubmit(true);
  },[reactionTime, originalTime, setDisableSubmit])
  
  useEffect(()=>{
    if(defaultData !== undefined){
      setReactionTime(formatTime(defaultData[0]));
      setOriginalTime(formatTime(defaultData[1].time));
      setIsOriginalPaused(defaultData[1].state === PointState.PAUSED)
    }
    
  },[defaultData, setReactionTime, setOriginalTime])

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <TimeInput label="Reaction" value={reactionTime} onChange={handleReactionTimeChange}/>
        </div>
        <ArrowRightAltIcon fontSize="large"  />
        <div>
          <TimeInput label="Original" value={originalTime} onChange={handleOriginalTimeChange}/>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <Checkbox color="primary" edge="end" checked={isOriginalPaused} onChange={handleIsOriginalPausedChange}/> Pause here
      </div>

      <Button fullWidth variant="contained" disabled={disableSubmit} onClick={handleSubmit}>
        Sync
      </Button>
    </>
  );
};

export default SyncPointForm;
