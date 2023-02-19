import { Autocomplete, TextField } from "@mui/material";

export const TagsInput = (props: {
  values: string[];
  setValues: (value: string[]) => void;
  possibleValues: string[];
}) => {
  return (
    <Autocomplete
      multiple={true}
      value={props.values}
      onChange={(event, newValue) => {
        if (Array.isArray(newValue)) {
          props.setValues(newValue);
        } else {
          props.setValues([]);
        }
      }}
      handleHomeEndKeys={true}
      freeSolo={true}
      fullWidth={true}
      options={props.possibleValues}
      renderInput={(params) => (
        <TextField {...params} label="Tags" sx={{ mb: "1rem" }} />
      )}
    />
  );
};
