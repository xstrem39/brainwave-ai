export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  const errors = [];
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
  return { valid: errors.length === 0, errors };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  if (name.trim().length > 100) return { valid: false, error: 'Name must be less than 100 characters' };
  return { valid: true };
};

export const validateRegistration = (data) => {
  const errors = {};
  if (!validateName(data.name).valid) errors.name = validateName(data.name).error;
  if (!validateEmail(data.email)) errors.email = 'Please enter a valid email address';
  const pwdResult = validatePassword(data.password);
  if (!pwdResult.valid) errors.password = pwdResult.errors[0];
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateLogin = (data) => {
  const errors = {};
  if (!validateEmail(data.email)) errors.email = 'Please enter a valid email address';
  if (!data.password) errors.password = 'Password is required';
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validatePrompt = (prompt) => {
  if (!prompt || !prompt.trim()) return { valid: false, error: 'Please enter a question or prompt' };
  if (prompt.trim().length < 3) return { valid: false, error: 'Prompt is too short' };
  if (prompt.length > 10000) return { valid: false, error: 'Prompt is too long (max 10,000 characters)' };
  return { valid: true };
};
