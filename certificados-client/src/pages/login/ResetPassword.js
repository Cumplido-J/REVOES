import React, { useState } from "react";
import { Modal, Form, Input } from "antd";
import { ButtonCustom, Loading } from "../../shared/components";
import { sendPasswordResetEmail } from "../../service/PasswordService";
import alerts from "../../shared/alerts";

const ResetPassword = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const validations = {
    email: [{ required: true, type: "email" }],
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleSend = async ({ email }) => {
    setLoading(true);
    const response = await sendPasswordResetEmail(email);
    if (response.success) {
      setShowModal(false);
      alerts.success("Listo", response.message);
      form.setFieldsValue({ email: "" });
    }
    setLoading(false);
  };

  const handleSendFailed = () => {};

  return (
    <>
      <ButtonCustom size="large" type="link" onClick={openModal}>
        Olvidé mi contraseña
      </ButtonCustom>
      <Modal
        visible={showModal}
        width="60%"
        title="Olvidé mi contraseña"
        okText="Enviar correo de recuperación"
        onCancel={closeModal}
        onOk={handleOk}
        confirmLoading={loading}
      >
        <Loading loading={loading}>
          <p>
            Introduzca el correo electrónico con el que esta registrado en la
            plataforma y de click en "Enviar correo de recuperación. Revise su
            correo electrónico, deberá recibir un correo electrónico con el
            título de ____, ábralo y siga las instrucciones."
          </p>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSend}
            onFinishFailed={handleSendFailed}
          >
            <Form.Item
              label="Correo Electrónico"
              name="email"
              rules={validations.email}
            >
              <Input />
            </Form.Item>
          </Form>
        </Loading>
      </Modal>
    </>
  );
};

export default ResetPassword;
