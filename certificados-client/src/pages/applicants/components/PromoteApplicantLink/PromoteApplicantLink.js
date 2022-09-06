import { ButtonIconLink } from "../../../../shared/components";
import { ToTopOutlined } from "@ant-design/icons";
import React from "react";
import { permissionList } from "../../../../shared/constants";
import PermissionValidator from "../../../../components/PermissionValidator";

const PromoteApplicantLink = ({ applicantId }) => {
  return (
    <PermissionValidator permissions={[permissionList.PROMOVER_ASPIRANTES]}>
      <ButtonIconLink
        tooltip="Promover"
        icon={<ToTopOutlined />}
        color="gold"
        link={`/Aspirantes/Promover/${applicantId}`}
        tooltipPlacement="top"
      />
    </PermissionValidator>
  );
};

export default PromoteApplicantLink;
