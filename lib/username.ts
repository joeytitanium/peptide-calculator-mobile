// Username validation rules
// - 3-20 characters
// - Letters, numbers, and underscores only
// - Case insensitive (stored lowercase)

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
export const USERNAME_SANITIZE_REGEX = /[^a-z0-9_]/g;

export const isValidUsername = (username: string): boolean => {
  return (
    username.length >= USERNAME_MIN_LENGTH &&
    username.length <= USERNAME_MAX_LENGTH &&
    USERNAME_REGEX.test(username)
  );
};

export const sanitizeUsername = (input: string): string => {
  return input
    .toLowerCase()
    .replace(USERNAME_SANITIZE_REGEX, '')
    .slice(0, USERNAME_MAX_LENGTH);
};
