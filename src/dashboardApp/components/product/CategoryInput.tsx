import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Category picker. Categories are plain strings on the product, so anything
 * the user types is a valid (new) category. The text field is fully
 * controlled: every keystroke is propagated, so a freshly typed category is
 * kept even when the user never opens the dropdown and never presses Enter
 * before saving.
 */
export const CategoryInput = (props: {
  value: string;
  setValue: (value: string) => void;
  possibleValues: string[];
  disabled?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Autocomplete
      value={props.value}
      inputValue={props.value}
      onChange={(event, newValue) => {
        props.setValue(typeof newValue === "string" ? newValue : "");
      }}
      onInputChange={(event, newInputValue) => {
        props.setValue(newInputValue);
      }}
      handleHomeEndKeys={true}
      freeSolo={true}
      selectOnFocus={true}
      fullWidth={true}
      disabled={props.disabled}
      options={props.possibleValues}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("product.category")}
          helperText={t("product.categoryHint")}
          sx={{ mb: "1rem" }}
        />
      )}
    />
  );
};
