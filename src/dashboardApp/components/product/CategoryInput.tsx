import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

export const CategoryInput = (props: {
  value: string;
  setValue: (value: string) => void;
  possibleValues: string[];
}) => {
  const { t } = useTranslation();

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
        <TextField
          {...params}
          label={t("product.category")}
          sx={{ mb: "1rem" }}
        />
      )}
    />
  );
};
