import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import PermissionValidator from "../../../components/PermissionValidator";
import { ButtonIcon } from "../../../shared/components";
import { permissionList } from "../../../shared/constants";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteStudentSearchTable } from "../../../reducers/studentsReducer/actions/deleteStudent";
import StudentService from "../../../service/StudentService";
import alerts from "../../../shared/alerts";

const DeleteStudent = ({ student }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const handleOpen = () => {
    setVisible(true);
  };
  const handleDelete = async () => {
    setLoading(true);
    const response = await StudentService.deleteStudent(student.usuario_id);
    if (response?.success) {
      dispatch(deleteStudentSearchTable(student));
      alerts.success("Listo", "Alumno eliminado con éxito.");
    }
    setLoading(false);
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <PermissionValidator permissions={[permissionList.ELIMINAR_ALUMNO]}>
      <ButtonIcon
        tooltip="Eliminar estudiante"
        color="red"
        onClick={handleOpen}
        tooltipPlacement="top"
        icon={<DeleteOutlined />}
        loading={loading}
      />
      <Modal
        visible={visible}
        title={"Eliminar estudiante"}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Entiendo lo anterior y deseo eliminar al alumno."
        confirmLoading={loading}
      >
        <p>
          ¿Está seguro de eliminar al alumno {student.usuario.primer_apellido}{" "}
          {student.usuario.segundo_apellido} {student.usuario.nombre}? La acción
          eliminará por completo los datos del alumno.
        </p>
        <p>Esta acción solo se podrá realizar si:</p>
        <ul>
          <li>El alumno no cuenta con calificaciones asignadas</li>
          <li>El alumno no cuenta con certificado</li>
          <li>El alumno haya respondido una encuesta</li>
        </ul>
      </Modal>
    </PermissionValidator>
  );
};
export default DeleteStudent;
