import PasswordApi from "../api/PasswordApi";
import alerts from "../shared/alerts";

export const sendPasswordResetEmail = async (email) => {
  const response = await PasswordApi.sendPasswordResetEmail(email);
  if (!response.success) {
    alerts.error("Ha ocurrido un error", response.message);
  }
  return response;
};

export const passwordResetEmail = async (
  email,
  password,
  passwordConfirmation,
  token
) => {
  const response = await PasswordApi.passwordResetEmail(
    email,
    password,
    passwordConfirmation,
    token
  );
  if (!response.success) {
    alerts.error("Ha ocurrido un error", response.message);
  }
  return response;
};

export const validateToken = async (token) => {
  const response = await PasswordApi.validateToken(token);
  if (!response.success) {
    alerts.error("Ha ocurrido un error", response.message);
  }
  return response;
};
/**
 *
 * @param {Object<{old_password: string, password: string, password_confirmation: string}>} data
 * @returns {Promise<{success: boolean, message?: string, data?:Object}>}
 */
export const userResetPassword = async (data) => {
  const response = await PasswordApi.userResetPassword(data);
  if (!response.success) {
    alerts.error("Ha ocurrido un error", response.message);
  }
  return response;
};
