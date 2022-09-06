import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd";
import { StopOutlined } from "@ant-design/icons";
import { ButtonIcon } from "../../../shared/components";
import {
  disableGroupsById,
  getFilteredGroups
} from "../../../service/GroupsService";
import { disableGroup } from "../../../reducers/groups/actions/disableGroup";
import Alerts from "../../../shared/alerts";

export default ({ groupData }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleOnClickDisable = () => {
    setVisible(true);
  };

  const handleOnCancel = async () => {
    setVisible(false);
  };

  const handleOnOk = async () => {
			setLoading(true);
      const apiResponse = await disableGroupsById(groupData.grupo_periodos[0].id);
      dispatch(disableGroup(groupData.id));
      setVisible(false);
      Alerts.warning(
        "Registro actualizado",
        `Se ha desactivado el grupo ${groupData.grupo}`
      );
  };

  return (
    <>
      <ButtonIcon
        tooltip="Desactivar"
        icon={<StopOutlined />}
        color="volcano"
        onClick={handleOnClickDisable}
        tooltipPlacement="top"
      />
      <Modal
        visible={visible}
        title="Deshabilitar grupo"
        onOk={handleOnOk}
        onCancel={handleOnCancel}
				confirmLoading={loading}
      >
        <p>¿Está seguro de deshabilitar al grupo {groupData.grupo}?</p>
      </Modal>
    </>
  );
};
