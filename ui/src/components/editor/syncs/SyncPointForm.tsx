import React from "react";
import {
  Button,
  Checkbox,
  Input,
  InputAdornment,
} from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import NumberFormat from "react-number-format";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import formatTimeInput from "../../../utils/formatTimeInput";

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

const TimeInput = ({ label }: { label?: string }) => (
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
    />
  </div>
);

const SyncPointForm = () => {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <TimeInput label="Reaction" />
        </div>
        <ArrowRightAltIcon fontSize="large" />
        <div>
          <TimeInput label="Original" />
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <Checkbox color="primary" edge="end" /> Pause here
      </div>

      <Button fullWidth variant="contained">
        Add
      </Button>
    </>
  );
};

export default SyncPointForm;
