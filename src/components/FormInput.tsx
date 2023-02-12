import { FormControl, TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IFormInputProps = {
  name: string;
  label: string;
} & TextFieldProps;

const FormInput: FC<IFormInputProps> = ({ name, label, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            {...field}
            label={label}
            variant="outlined"
            error={!!errors[name]}
            helperText={(errors[name]?.message as unknown as string) ?? ""}
            {...otherProps}
          />
        </FormControl>
      )}
    />
  );
};

export default FormInput;
