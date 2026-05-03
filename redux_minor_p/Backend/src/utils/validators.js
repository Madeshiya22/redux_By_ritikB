// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Password validation - atleast 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return false;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  return passwordRegex.test(password);
};

// Simple password validation - atleast 6 chars for demo
export const validatePasswordSimple = (password) => {
  return password && password.length >= 6;
};

// Name validation
export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// Validate registration input
export const validateRegistrationInput = (name, email, password) => {
  const errors = {};

  if (!validateName(name)) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!validateEmail(email)) {
    errors.email = "Please provide a valid email address";
  }

  if (!validatePasswordSimple(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate login input
export const validateLoginInput = (email, password) => {
  const errors = {};

  if (!validateEmail(email)) {
    errors.email = "Please provide a valid email address";
  }

  if (!password || password.length === 0) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
