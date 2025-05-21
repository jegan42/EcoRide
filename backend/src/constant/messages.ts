// backend/src/constant/messages.ts
export const messages = {
  SUCCESS: (item: string, method: string = ''): string =>
    `Successfully ${method}: ${item}`,
  SUCCESS_CREATE: (item: string, method: string = ''): string =>
    `Successfully ${method}: ${item}`,

  FAILED: (item: string, method: string): string =>
    `Failed to ${method}: ${item}`,
  INVALID: (item: string, method: string = ''): string =>
    `Invalid ${method}: ${item}`,
  MISSING: (item: string, method: string = ''): string =>
    `Missing ${method}: ${item}`,
  BAD_REQUEST: (item: string, _method: string = ''): string =>
    `Bad request: ${item}`,
  REQUIRED: (field: string, _method: string = ''): string =>
    `${field} is required`,

  UNAUTHORIZED: (item: string, _method: string = ''): string =>
    `Authentication required: ${item}`,
  FORBIDDEN: (item: string, _method: string = ''): string =>
    `Access denied: ${item}`,

  NOT_FOUND: (item: string, _method: string = ''): string =>
    `Not found: ${item}`,

  ALREADY: (item: string, method: string = ''): string =>
    `Already ${method}: ${item}`,
  CONFLICT: (item: string, method: string = ''): string =>
    `Conflict ${method}: ${item}`,

  LIMIT_EXCEEDED: (item: string, _method: string = ''): string =>
    `Limit exceeded: ${item}`,

  ERROR: (item: string, method: string = ''): string =>
    `Error ${method}: ${item}`,
};

export type Message = (typeof messages)[keyof typeof messages];
