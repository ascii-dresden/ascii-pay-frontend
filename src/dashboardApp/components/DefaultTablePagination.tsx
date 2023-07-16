import { TablePagination } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export const DefaultTablePagination = (props: {
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) => {
  const { t } = useTranslation();

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={[
        5,
        10,
        25,
        { label: t("layout.rowsPerPageAll"), value: -1 },
      ]}
      labelRowsPerPage={t("layout.rowsPerPage")}
      SelectProps={{
        inputProps: {
          "aria-label": "rows per page",
        },
        native: true,
      }}
      count={props.count}
      rowsPerPage={props.rowsPerPage}
      page={props.page}
      onPageChange={props.onPageChange}
      onRowsPerPageChange={props.onRowsPerPageChange}
    />
  );
};
