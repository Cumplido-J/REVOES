import React, { useState } from "react";
import { Modal } from "antd";
import { UserSwitchOutlined } from "@ant-design/icons";
import { ButtonIcon, SearchSelect } from "../../../shared/components";
import {
  availableGroupPeriodsFromAnStudent,
  changeStudentToAnotherGroup,
} from "../../../service/GroupsPeriodService";
import alerts from "../../../shared/alerts";

export default ({ student }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableGroupPeriods, setAvailableGroupPeriods] = useState([]);
  const [newGroup, setNewGroup] = useState(undefined);

  const handleOnClickChangeGroup = async () => {
    setLoading(true);
    const availableGroupsResponse = await availableGroupPeriodsFromAnStudent(
      student.id
    );
    if (availableGroupsResponse.success) {
      setVisible(true);
      setAvailableGroupPeriods(
        availableGroupsResponse.data.data.map((g) => ({
          id: g.id,
          description: g.grupo,
        }))
      );
    }
    setLoading(false);
  };
  const handleOnSearchSelectChange = (value) => {
    setNewGroup(value);
  };
  const handleOnOk = async () => {
    if (newGroup) {
      setLoading(true);
      const response = await changeStudentToAnotherGroup({
        alumno_id: student.id,
        grupo_periodo_id: newGroup,
      });
      if (response.success) {
        alerts.success("Listo", response.message);
        setVisible(false);
      }
      setLoading(false);
    } else {
      alerts.warning("Error", "No se ha seleccionado un grupo.");
    }
  };
  const handleOnCancel = () => {
    setLoading(false);
    setVisible(false);
  };
  const showIcon = () => {
    return (
      student?.id && Array.isArray(student?.grupos) && student?.grupos[0]?.id
    );
  };
  return showIcon() ? (
    <>
      <ButtonIcon
        tooltip="Cambiar estudiante de grupo"
        icon={<UserSwitchOutlined />}
        color="red"
        onClick={handleOnClickChangeGroup}
        tooltipPlacement="top"
        loading={loading}
      />
      <Modal
        visible={visible}
        title="Cambiar de grupo"
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        confirmLoading={loading}
      >
        <p>
          ¿Desea cambiar de grupo a {student.usuario.nombre}{" "}
          {student.usuario.primer_apellido} {student.usuario.segundo_apellido}?
        </p>
        <SearchSelect
          dataset={availableGroupPeriods}
          onChange={handleOnSearchSelectChange}
          value={newGroup}
        />
      </Modal>
    </>
  ) : false;
};
