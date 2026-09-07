import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Tag picker. Tags are free text, so `autoSelect` commits whatever is typed
 * when the field loses focus — otherwise a typed tag would be dropped
 * silently when the user saves without pressing Enter first.
 */
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
          label={t("product.tags")}
          helperText={t("product.tagsHint")}
          sx={{ mb: "1rem" }}
        />
      )}
    />
  );
};
