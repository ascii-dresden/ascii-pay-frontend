import "i18next";

import i18n_english from "./locales/en/translation.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: typeof i18n_english;
    };
  }
}
