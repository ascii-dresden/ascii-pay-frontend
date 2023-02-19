import { Autocomplete, TextField } from "@mui/material";

export const CategoryInput = (props: {
  value: string;
  setValue: (value: string) => void;
  possibleValues: string[];
}) => {
  return (
    <Autocomplete
      value={props.value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          props.setValue(newValue);
        } else {
          props.setValue("");
        }
      }}
      handleHomeEndKeys={true}
      freeSolo={true}
      fullWidth={true}
      options={props.possibleValues}
      renderInput={(params) => (
        <TextField {...params} label="Category" sx={{ mb: "1rem" }} />
      )}
    />
  );
};
