// backend/src/constant/messages.ts
export const messages = {
  SUCCESS: (method: string, item: string): string =>
    `Successfully ${method}: ${item}`,
  SUCCESS_CREATE: (method: string, item: string): string =>
    `Successfully ${method}: ${item}`,

  BAD_REQUEST: (method: string, item: string): string =>
    `Bad request ${method}: ${item}`,
  UNAUTHORIZED: (method: string, item: string): string =>
    `Authentication ${method}: ${item}`,
  FORBIDDEN: (method: string, item: string): string =>
    `Access ${method}: ${item}`,
  NOT_FOUND: (method: string, item: string): string =>
    `Not found ${method}: ${item}`,
  CONFLICT: (method: string, item: string): string =>
    `Conflict ${method}: ${item}`,
  LIMIT_EXCEEDED: (method: string, item: string): string =>
    `Limit exceeded ${method}: ${item}`,

  ERROR: (method: string, item: string): string => `Error ${method}: ${item}`,
};

export type Message = (typeof messages)[keyof typeof messages];
