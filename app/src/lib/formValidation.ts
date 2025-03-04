export function emailValidation(email: string){
  const trimmedEmail = email.trim();
  const errors = [];

  if (!trimmedEmail) return [];
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  const isValidformat = emailRegex.test(trimmedEmail);

  if (!isValidformat) errors.push('Not a valid email format');

  return errors;
}

export function passwordValidation(password: string){
  if (!password) return [];

  const errors = [];

  if (password.length < 6) errors.push('Password must be more than 6 characters');
  return errors;
}
