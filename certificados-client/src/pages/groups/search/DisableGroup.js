import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ButtonIcon } from "../../../shared/components";
import { deleteGroupById } from "../../../service/GroupsService";
import { deleteGroup } from "../../../reducers/groups/actions/deleteGroup";
import Alerts from "../../../shared/alerts";

export default ({ groupData }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userPermissions = useSelector(
    (state) => state.permissionsReducer.permissions
  );
  const handleOnClickDisable = () => {
    setVisible(true);
  };

  const handleOnCancel = async () => {
    setVisible(false);
  };

  const handleOnOk = async () => {
    setLoading(true);
    const apiResponse = await deleteGroupById(groupData.id);
    if (apiResponse.success) {
      // TODO: Cambiar texto por numeralia
      if (userPermissions.includes("Aprobar grupos")) {
        dispatch(deleteGroup(groupData.id));
      }
      Alerts.warning("Actualización de registro", apiResponse.message);
    }
    setVisible(false);
  };

  return (
    <>
      <ButtonIcon
        tooltip="Eliminar"
        icon={<DeleteOutlined />}
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
        <p>¿Está seguro de eliminar al grupo {groupData.grupo}?</p>
      </Modal>
    </>
  );
};
