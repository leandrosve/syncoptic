import { FilledInput, FilledInputProps, InputAdornment } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import YouTubeIcon from "@material-ui/icons/YouTube";

const URLInput:FunctionComponent<FilledInputProps> = (props) => (
    <FilledInput
      fullWidth
      color="primary"
      inputProps={{ style: { padding: "15px" }, maxlength: "100" }}
      startAdornment={
        <InputAdornment position="start">
          <YouTubeIcon style={{ color: "red" }} />
          <strong>URL</strong>
        </InputAdornment>
      }
      {...props}
    />
  );
  export default URLInput;