// backend/src/utils/validation.ts
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isId = (id: string): boolean => {
  return Boolean(id && UUID_REGEX.test(id));
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (email: string): boolean => {
  return Boolean(email && EMAIL_REGEX.test(email));
};

export const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const isCorrectPassword = (password: string): boolean => {
  return Boolean(password && PASSWORD_REGEX.test(password));
};

export const USERNAME_REGEX = /^[a-zA-Z]\w{3,20}$/;

export const isCorrectUsername = (username: string): boolean => {
  return Boolean(username && USERNAME_REGEX.test(username));
};
