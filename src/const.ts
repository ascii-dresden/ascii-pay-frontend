export const USE_DEV_MODE = !import.meta.env.PROD;

export const USE_DEV_COLOR_SCHEMA = true;

export const BASE_URL = USE_DEV_MODE
  ? `${location.origin}/api/v1`
  : `https://pay.ascii.coffee/api/v1`;
