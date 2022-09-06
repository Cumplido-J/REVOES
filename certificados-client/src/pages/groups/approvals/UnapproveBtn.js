import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { StopOutlined } from "@ant-design/icons";
import { ButtonIcon } from "../../../shared/components";
import Alerts from "../../../shared/alerts";
import { setGroupApprovalStatus } from "../../../service/ApprovalsService";
import { deleteGroupFromUnapproved } from "../../../reducers/groups/actions/deleteFromUnapprovedTable";

export default ({ groupData }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOnClickDisable = () => {
    setVisible(true);
  };
  const dispatch = useDispatch();

  const handleOnCancel = async () => {
    setVisible(false);
  };

  const handleOnOk = async () => {
    setLoading(true);
    // Api call
    const approvalResponse = await setGroupApprovalStatus(
      groupData.id,
      {
        aprobar: false,
      },
      groupData.url
    );
    if (approvalResponse.success) {
      dispatch(deleteGroupFromUnapproved(groupData));
      Alerts.success("Registro actualizado", approvalResponse.message);
    } else {
      Alerts.error("Registro actualizado", approvalResponse.message);
    }
    setLoading(false);
    setVisible(false);
  };

  return (
    <>
      <ButtonIcon
        tooltip="Rechazar"
        icon={<StopOutlined />}
        color="volcano"
        onClick={handleOnClickDisable}
        tooltipPlacement="top"
      />
      <Modal
        visible={visible}
        title="Rechazar solicitud"
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        confirmLoading={loading}
      >
        <p>¿Está seguro de rechazar el cambio del grupo {groupData.grupo}?</p>
      </Modal>
    </>
  );
};
