import React from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers/DatePicker";
// import styles from "./DatePicker.module.scss";

const DatePicker = ({ label, value, onChange, error, helperText }) => {
  return (
    <div className={styles.dateField}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MUIDatePicker
          label={label}
          value={value}
          onChange={onChange}
          renderInput={(params) => (
            <TextField {...params} error={error} helperText={helperText} />
          )}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DatePicker;
