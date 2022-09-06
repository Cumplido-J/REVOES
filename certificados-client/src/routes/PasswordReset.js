import PasswordReset from "../pages/passwordReset/PasswordReset";

export const PasswordResetRoutes = {
  resetPassword: {
    path: "/password-reset/:token",
    Component: PasswordReset,
    Permissions: [],
  },
};
