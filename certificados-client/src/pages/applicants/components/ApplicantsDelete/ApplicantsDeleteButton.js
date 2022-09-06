import React, { useState } from "react";
import { ButtonIcon } from "../../../../shared/components";
import { DeleteOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { deleteApplicantById } from "../../../../service/ApplicantsService";
import Alerts from "../../../../shared/alerts";
import PermissionValidator from "../../../../components/PermissionValidator";
import { permissionList } from "../../../../shared/constants";
import usePermissionValidator from "../../../../hooks/auth/usePermissionValidator";
import { deleteApplicant } from "../../../../reducers/applicantsReducer/actions/deleteApplicant";
import { useDispatch } from "react-redux";

const ApplicantsDeleteButton = ({ applicantData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentUserHasPermissions] = usePermissionValidator();
  const handleOnClickDelete = () => {
    setVisible(true);
  };
  const handleOnOk = async () => {
    if (!currentUserHasPermissions) return;
    setLoading(true);
    const deleteResponse = await deleteApplicantById({ id: applicantData?.id });
    if (deleteResponse.success) {
      dispatch(deleteApplicant(applicantData?.id));
      Alerts.success(
        "Actualización de registro",
        deleteResponse.message || "Se ha eliminado el aspirante con éxito."
      );
      setVisible(false);
    }
    setLoading(false);
  };
  const handleOnCancel = () => {
    setVisible(false);
  };
  return (
    <PermissionValidator permissions={[permissionList.ELIMINAR_ASPIRANTES]}>
      <ButtonIcon
        tooltip="Eliminar"
        icon={<DeleteOutlined />}
        color="volcano"
        onClick={handleOnClickDelete}
        tooltipPlacement="top"
      />
      <Modal
        visible={visible}
        title="Eliminar aspirante"
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        confirmLoading={loading}
      >
        <p>
          ¿Está seguro de eliminar al aspirante {applicantData.nombreCompleto}?
        </p>
      </Modal>
    </PermissionValidator>
  );
};

export default ApplicantsDeleteButton;
