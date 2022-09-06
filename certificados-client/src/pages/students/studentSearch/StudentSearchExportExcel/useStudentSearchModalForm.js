import { useState } from "react";
import { Form } from "antd";

const useStudentSearchModalForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const formSwitches = [
    {
      label: "Fecha de nacimiento",
      name: "fecha_nacimiento",
    },
    {
      label: "Domicilio",
      name: "domicilio",
    },
    {
      label: "Teléfono",
      name: "telefono",
    },
    {
      label: "Correo electrónico",
      name: "email",
    },
    {
      label: "Sexo",
      name: "sexo",
    },
  ];
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const onOk = () => {
    form.submit();
  };
  return [showModal, openModal, closeModal, onOk, form, formSwitches];
};
export default useStudentSearchModalForm;
