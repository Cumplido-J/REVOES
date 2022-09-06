import React, { useState } from "react";
import { Modal } from "antd";
import { ButtonIcon } from "../../../shared/components";
import { ArrowDownOutlined } from "@ant-design/icons";
import { updateStudentSearchTable } from "../../../reducers/studentsReducer/actions/updateStudent";
import StudentApi from "../../../api/StudentApi";
import alerts from "../../../shared/alerts";
import { useDispatch } from "react-redux";

export default ({ student }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleOnClickWithdraw = () => {
    setVisible(true);
  };
  const handleOnOk = async () => {
    setLoading(true);
    const response = await StudentApi.studentWithdraw(student.usuario_id);
    if (response.success) {
      alerts.success("Listo", response.data.message);
      dispatch(
        updateStudentSearchTable({
          ...student,
          estatus_inscripcion: "Baja",
        })
      );
    }
    setLoading(false);
    setVisible(false);
  };
  const handleOnCancel = () => {
    setVisible(false);
  };
  return (
    <>
      <ButtonIcon
        tooltip="Baja Estudiante"
        icon={<ArrowDownOutlined />}
        color="red"
        onClick={handleOnClickWithdraw}
        tooltipPlacement="top"
      />
      <Modal
        visible={visible}
        title="Dar de baja estudiante"
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        confirmLoading={loading}
      >
        <p>
          ¿Está seguro de dar de baja al alumno {student.usuario.nombre}{" "}
          {student.usuario.primer_apellido} {student.usuario.segundo_apellido}?
        </p>
      </Modal>
    </>
  );
};
