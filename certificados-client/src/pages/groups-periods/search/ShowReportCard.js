import React, { useState } from "react";
import { ButtonCustom, ButtonIcon } from "../../../shared/components";
import { FileDoneOutlined } from "@ant-design/icons";
import { getReportCardByGroupPeriod } from "../../../service/ReportCardService";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";

export default ({ group, iconMode = true }) => {
  const [loading, setLoading] = useState(false);
  const handleOnClickReportCard = async () => {
    setLoading(true);
    const pdfResponse = await getReportCardByGroupPeriod(group.id);
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return (
    <PermissionValidator permissions={[permissionList.GENERAR_BOLETAS]}>
      {iconMode ? (
        <ButtonIcon
          tooltip="Boleta de calificaciones"
          icon={<FileDoneOutlined />}
          color="geekblue"
          onClick={handleOnClickReportCard}
          tooltipPlacement="top"
          loading={loading}
        />
      ) : (
        <ButtonCustom
          icon={<FileDoneOutlined />}
          onClick={handleOnClickReportCard}
          loading={loading}
        >
          Boleta de calificaciones
        </ButtonCustom>
      )}
    </PermissionValidator>
  );
};
