// export const BASE_URL = `${window.origin}/api/v1`;
export const BASE_URL = import.meta.env.PROD
  ? `https://pay.ascii.coffee/api/v1`
  : `http://localhost:3000/api/v1`;
