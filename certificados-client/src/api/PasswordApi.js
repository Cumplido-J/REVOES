import apicall from "../shared/apicall";
import async from "async";

const phpController = "password";

export default {
  sendPasswordResetEmail: async (email) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        phpController,
        "create",
        { email },
        true
      );
      response.message = apiResponse.data.message;
    } catch (error) {
      response = apicall.handleCatch(error);
    }
    return response;
  },
  passwordResetEmail: async (email, password, passwordConfirmation, token) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        phpController,
        "reset",
        {
          email,
          password,
          password_confirmation: passwordConfirmation,
          token,
        },
        true
      );
      response.message = apiResponse.data.message;
    } catch (error) {
      response = apicall.handleCatch(error);
    }
    return response;
  },
  validateToken: async (token) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        phpController,
        "validate",
        { token },
        true
      );
      response.message = apiResponse.data.message;
    } catch (error) {
      response = apicall.handleCatch(error);
    }
    return response;
  },
  /**
   *
   * @param {Object<{old_password: string, password: string, password_confirmation: string}>} data
   * @returns {Promise<{success: boolean, message?: string, data?:Object}>}
   */
  userResetPassword: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        phpController,
        "reset-without-token",
        data,
        true
      );
      response.message = apiResponse.data.message;
    } catch (e) {
      response = apicall.handleCatch(e);
    }
    return response;
  },
};
