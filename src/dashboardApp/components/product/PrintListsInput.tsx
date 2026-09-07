import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Print list picker. Like tags these are free text, so `autoSelect` commits
 * what was typed when the field loses focus instead of dropping it.
 */
export const PrintListsInput = (props: {
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
          props.setValues(
            Array.from(
              new Set(newValue.map((v) => v.trim()).filter((v) => v.length > 0))
            )
          );
        } else {
          props.setValues([]);
        }
      }}
      handleHomeEndKeys={true}
      freeSolo={true}
      autoSelect={true}
      fullWidth={true}
      options={props.possibleValues}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("product.printLists")}
          helperText={t("product.printListsHint")}
          sx={{ mb: "1rem" }}
        />
      )}
    />
  );
};
