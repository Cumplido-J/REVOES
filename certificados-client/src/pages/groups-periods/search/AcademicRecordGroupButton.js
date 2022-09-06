import React, { useState } from "react";
import { ButtonCustom, ButtonIcon, Loading } from "../../../shared/components";
import { FileSearchOutlined } from "@ant-design/icons";
import { academicRecordByGroupPeriod } from "../../../service/GroupsPeriodService";
import { useSelector } from "react-redux";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";

const AcademicRecordGroupButton = ({
  groupPeriodId,
  periodId,
  iconMode = true,
}) => {
  const [loading, setLoading] = useState(false);
  const currentPeriodId = useSelector(
    (state) => state.permissionsReducer.period.id
  );
  const handleClick = async () => {
    setLoading(true);
    const pdfResponse = await academicRecordByGroupPeriod(groupPeriodId);
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return (
    <PermissionValidator
      permissions={[permissionList.GENERAR_BOLETAS]}
      allPermissions={true}
    >
      {iconMode ? (
        <ButtonIcon
          tooltip="Historial académico"
          icon={<FileSearchOutlined />}
          color="gold"
          onClick={handleClick}
          tooltipPlacement="top"
          loading={loading}
        />
      ) : (
        <ButtonCustom
          icon={<FileSearchOutlined />}
          onClick={handleClick}
          loading={loading}
        >
          Historial académico
        </ButtonCustom>
      )}
    </PermissionValidator>
  );
};

export default AcademicRecordGroupButton;
