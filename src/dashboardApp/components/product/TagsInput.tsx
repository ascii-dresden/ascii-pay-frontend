import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

export const TagsInput = (props: {
  values: string[];
  setValues: (value: string[]) => void;
  possibleValues: string[];
}) => {
  const { t } = useTranslation();

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
        <TextField {...params} label={t("product.tags")} sx={{ mb: "1rem" }} />
      )}
    />
  );
};
