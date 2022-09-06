import { useState } from "react";
import { Form } from "antd";
import { userResetPassword } from "../../../service/PasswordService";
import alerts from "../../../shared/alerts";

const useUpdatePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleFinish = async (data) => {
    setLoading(true);
    const response = await userResetPassword(data);
    if (response.success) {
      alerts.success("Listo", response.message);
      form.setFieldsValue({
        old_password: "",
        password: "",
        password_confirmation: "",
      });
    }
    setLoading(false);
  };
  const handleFinishFailed = () => {};
  const validations = {
    required: [
      {
        required: true,
        message: "Este campo es requerido",
      },
    ],
    passwordMatch: ({ getFieldValue }) => ({
      validator: (_, value) => {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Las contraseñas no coinciden"));
      },
    }),
  };
  return [validations, form, loading, handleFinish, handleFinishFailed];
};
export default useUpdatePassword;
