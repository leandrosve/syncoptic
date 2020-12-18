import { FilledInput, FilledInputProps, InputAdornment, Omit } from "@material-ui/core";
import React, { ChangeEvent, FunctionComponent, useEffect, useRef, useState } from "react";
import YouTubeIcon from "@material-ui/icons/YouTube";


interface Props extends  Omit<FilledInputProps , "defaultValue">{
    defaultValue?:string;
};

const URLInput:FunctionComponent<Props> = ({defaultValue ="", ...props}) => {
  const ref = useRef<HTMLInputElement>();
  const [val, setVal] = useState<string>("");

  const handleChange = (e:ChangeEvent<HTMLInputElement>) =>{
    setVal(e.target.value);
  }

  useEffect(()=>{
    setVal(defaultValue);
  },[setVal, defaultValue])

  return(
    <FilledInput
      fullWidth
      inputRef={ref}
      color="primary"
      onChange={handleChange}
      value={val}
      inputProps={{ style: { padding: "15px" }, maxlength: "100" }}
      startAdornment={
        <InputAdornment position="start">
          <YouTubeIcon style={{ color: "red" }} />
          <strong>URL</strong>
        </InputAdornment>
      }
      defaultValue={defaultValue}
      {...props}
    />
  );}
  export default URLInput;