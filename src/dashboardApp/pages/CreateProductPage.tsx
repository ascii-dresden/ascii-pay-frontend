import {
  Box,
  Button,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateProductMutation } from "../redux/api/productApi";
import { usePageTitle } from "../components/usePageTitle";
import { FormPage, useReturnTo } from "../components/FormPage";
import { PageHeaderNavigation } from "../components/PageHeader";
import {
  emptyProductFormValue,
  ProductBasicsFields,
  ProductFormValue,
  ProductListsFields,
  ProductPricingFields,
  productFormValueToSaveDto,
} from "../components/product/ProductForm";
import { emptyProductBarcode } from "../components/product/ProductBarcodesInput";

const STEP_KEYS = ["basics", "lists", "pricing"] as const;
const STEP_COUNT = STEP_KEYS.length;

/**
 * Three-step wizard for creating a product: basics (name, nickname, category,
 * barcode), lists (tags, print lists, inventory) and pricing. The current
 * step is kept in the `step` query parameter so the browser back button
 * walks the steps back.
 */
export const CreateProductPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const returnTo = useReturnTo("");
  const initialBarcode = searchParams.get("barcode");

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [value, setValue] = React.useState<ProductFormValue>(() => {
    const initial = emptyProductFormValue();
    if (initialBarcode) {
      initial.barcodes = [emptyProductBarcode(initialBarcode)];
      initial.stocked = true;
    }
    return initial;
  });
  const [nameError, setNameError] = React.useState(false);

  const nameValid = value.name.trim().length > 0;

  // Step index (0-based) derived from the URL, clamped to what the entered
  // data allows: steps 2 and 3 require a name.
  const requestedStep = parseInt(searchParams.get("step") ?? "1", 10);
  const step = Math.min(
    Math.max(isNaN(requestedStep) ? 1 : requestedStep, 1),
    nameValid ? STEP_COUNT : 1
  ) - 1;

  usePageTitle([
    t("layout.products"),
    t("product.edit.createTitle"),
    t(`product.edit.steps.${STEP_KEYS[step]}`),
  ]);

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.products"),
      target: "/products",
    },
    {
      label: t("product.action.createProduct"),
      target: "/products/new",
    },
  ];

  const backTo = returnTo || "/products";

  const goToStep = (index: number, replace = false) => {
    const next = new URLSearchParams(searchParams);
    if (index <= 0) {
      next.delete("step");
    } else {
      next.set("step", (index + 1).toString());
    }
    setSearchParams(next, { replace });
    window.scrollTo({ top: 0 });
  };

  const goNext = () => {
    if (step === 0 && !nameValid) {
      setNameError(true);
      return;
    }
    if (step < STEP_COUNT - 1) {
      goToStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      goToStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!nameValid) {
      goToStep(0);
      setNameError(true);
      return;
    }
    try {
      const product = await createProduct(
        productFormValueToSaveDto(value)
      ).unwrap();
      toast.success(t("product.edit.createSuccess"));
      navigate(returnTo || `/products/${product.id}`);
    } catch (e) {
      toast.error(t("product.edit.createError"));
      console.error(e);
    }
  };

  const onChange = (patch: Partial<ProductFormValue>) => {
    if (patch.name !== undefined && patch.name.trim().length > 0) {
      setNameError(false);
    }
    setValue((v) => ({ ...v, ...patch }));
  };

  const isLast = step === STEP_COUNT - 1;

  const sectionProps = {
    value,
    onChange,
    disabled: isLoading,
  };

  return (
    <FormPage
      title={t("product.edit.createTitle")}
      subtitle={t("product.edit.stepOf", {
        step: step + 1,
        total: STEP_COUNT,
        title: t(`product.edit.steps.${STEP_KEYS[step]}`),
      })}
      navigation={navigation}
      backTo={backTo}
      actions={
        <>
          {step === 0 ? (
            <Button variant="outlined" onClick={() => navigate(backTo)}>
              {t("product.edit.cancel")}
            </Button>
          ) : (
            <Button variant="outlined" onClick={goBack} disabled={isLoading}>
              {t("product.edit.back")}
            </Button>
          )}
          {isLast ? (
            <LoadingButton
              variant="contained"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={!nameValid}
            >
              {t("product.edit.createAction")}
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              onClick={goNext}
              disabled={step === 0 && !nameValid}
            >
              {t("product.edit.next")}
            </Button>
          )}
        </>
      }
    >
      <Stepper
        nonLinear
        activeStep={step}
        alternativeLabel
        sx={{ mb: 3, mt: 0.5 }}
      >
        {STEP_KEYS.map((key, index) => {
          const completed = index < step;
          const label = t(`product.edit.steps.${key}`);
          return (
            <Step key={key} completed={completed}>
              {completed ? (
                <StepButton onClick={() => goToStep(index)}>
                  {label}
                </StepButton>
              ) : (
                <StepLabel>{label}</StepLabel>
              )}
            </Step>
          );
        })}
      </Stepper>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {t(`product.edit.steps.${STEP_KEYS[step]}`)}
      </Typography>
      <Box
        component="form"
        key={step}
        noValidate
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          if (isLast) {
            handleSubmit();
          } else {
            goNext();
          }
        }}
      >
        {step === 0 && (
          <ProductBasicsFields
            {...sectionProps}
            nameError={
              nameError ? t("product.edit.nameRequired") ?? undefined : undefined
            }
          />
        )}
        {step === 1 && <ProductListsFields {...sectionProps} />}
        {step === 2 && <ProductPricingFields {...sectionProps} />}
        {/* Lets Enter submit the form even when no submit button is inside. */}
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </Box>
    </FormPage>
  );
};
