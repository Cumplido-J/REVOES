import React from "react";
import Modal from "antd/lib/modal/Modal";
import { useState } from "react";
import PermissionValidator from "../../../components/PermissionValidator";
import StudentService from "../../../service/StudentService";
import { ButtonIcon } from "../../../shared/components";
import { permissionList } from "../../../shared/constants";
import { UserDeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateStudentSearchTable } from "../../../reducers/studentsReducer/actions/updateStudent";
import alerts from "../../../shared/alerts";

const RemoveStudentFromGroup = ({ student }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleRemove = async () => {
    setLoading(true);
    const response = await StudentService.removeStudentFromGroups(
      student.usuario_id,
      student.grupos[0].id
    );
    if (response.success) {
      dispatch(
        updateStudentSearchTable({
          ...student,
          grupos: [],
        })
      );
      alerts.success("Listo", "Alumno removido del grupo con éxito.");
      setVisible(false);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    setVisible(false);
  };

  const showIcon = () => {
    return (
      student?.id && Array.isArray(student?.grupos) && student?.grupos[0]?.id
    );
  };

  return (
    <PermissionValidator
      permissions={[permissionList.INSCRIBIR_ALUMNOS_A_GRUPO]}
    >
      {showIcon() && (
        <>
          <ButtonIcon
            tooltip="Remover estudiante del grupo"
            color="red"
            onClick={handleOpen}
            tooltipPlacement="top"
            icon={<UserDeleteOutlined />}
            loading={loading}
          />
          <Modal
            visible={visible}
            title="Remover un estudiante del grupo"
            onOk={handleRemove}
            onCancel={handleCancel}
            okText="Acepto"
            cancelText="Cancelar"
            confirmLoading={loading}
          >
            <p>
              ¿Está seguro que desea remover a{" "}
              <b style={{ fontWeight: "700" }}>
                {student.usuario.nombre} {student.usuario.primer_apellido}{" "}
                {student.usuario.segundo_apellido}{" "}
              </b>
              del grupo{" "}
              <b style={{ fontWeight: "700" }}>
                {student.grupos[0].semestre}-{student.grupos[0].grupo}?
              </b>
            </p>
          </Modal>
        </>
      )}
    </PermissionValidator>
  );
};

export default RemoveStudentFromGroup;
