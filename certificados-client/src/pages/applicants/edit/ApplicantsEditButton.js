import React from "react";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import { ButtonIconLink } from "../../../shared/components";
import { EditOutlined } from "@ant-design/icons";

const ApplicantsEditButton = ({ applicantId }) => {
  return (
    <PermissionValidator permissions={[permissionList.EDITAR_ASPIRANTES]}>
      <ButtonIconLink
        tooltip="Editar"
        icon={<EditOutlined />}
        color="geekblue"
        link={`/Aspirantes/Registrar/${applicantId}`}
        tooltipPlacement="top"
      />
    </PermissionValidator>
  );
};

export default ApplicantsEditButton;
