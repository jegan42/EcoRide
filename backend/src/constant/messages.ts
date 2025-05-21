// backend/src/constant/messages.ts
export const messages = {
  SUCCESS: (item: string, method = '') => `Successfully ${method}: ${item}`,
  SUCCESS_CREATE: (item: string, method = '') =>
    `Successfully ${method}: ${item}`,

  FAILED: (item: string, method: string) => `Failed to ${method}: ${item}`,
  INVALID: (item: string, method = '') => `Invalid ${method}: ${item}`,
  MISSING: (item: string, method = '') => `Missing ${method}: ${item}`,
  BAD_REQUEST: (item: string) => `Bad request: ${item}`,
  REQUIRED: (field: string) => `${field} is required`,

  UNAUTHORIZED: (item: string) => `Authentication required : ${item}`,
  FORBIDDEN: (item: string) => `Access denied : ${item}`,

  NOT_FOUND: (item: string) => `Not found : ${item}`,

  ALREADY: (item: string, method = '') => `Already ${method}: ${item}`,
  CONFLICT: (item: string, method = '') => `Conflict ${method}: ${item}`,

  LIMIT_EXCEEDED: (item: string) => `Limit exceeded: ${item}`,

  ERROR: (item: string, method = '') => `Error ${method}: ${item}`,
};

export type Message = (typeof messages)[keyof typeof messages];
