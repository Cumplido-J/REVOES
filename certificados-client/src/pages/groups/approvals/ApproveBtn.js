import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { ButtonIcon } from "../../../shared/components";
import Alerts from "../../../shared/alerts";
import { setGroupApprovalStatus } from "../../../service/ApprovalsService";
import { deleteGroupFromUnapproved } from "../../../reducers/groups/actions/deleteFromUnapprovedTable";

export default ({ groupData }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOnClick = () => {
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
        aprobar: true,
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
        tooltip="Aprobar"
        icon={<CheckOutlined />}
        color="green"
        onClick={handleOnClick}
        tooltipPlacement="top"
      />
      <Modal
        visible={visible}
        title="Aprobar solucitud"
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        confirmLoading={loading}
      >
        <p>¿Está seguro de aprobar el cambio del grupo {groupData.grupo}?</p>
      </Modal>
    </>
  );
};
