// backend/src/constant/statusCodes.ts
export const statusCodes = {
  SUCCESS: 200,
  SUCCESS_CREATE: 201,

  FAILED: 400,
  INVALID: 400,
  MISSING: 400,
  BAD_REQUEST: 400,
  REQUIRED: 400,

  UNAUTHORIZED: 401,
  FORBIDDEN: 403,

  NOT_FOUND: 404,

  ALREADY: 409,
  CONFLICT: 409,

  LIMIT_EXCEEDED: 429,

  ERROR: 500,
};

export type StatusCode = (typeof statusCodes)[keyof typeof statusCodes];
