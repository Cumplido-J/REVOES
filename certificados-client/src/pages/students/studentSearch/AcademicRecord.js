import React, { useState } from "react";
import { ButtonCustom, ButtonIcon } from "../../../shared/components";
import { FileDoneOutlined } from "@ant-design/icons";
import { getAcademicRecord } from "../../../service/ReportCardService";

export default ({ student, icon = true }) => {
  const [loading, setLoading] = useState(false);
  const handleOnClickReportCard = async () => {
    setLoading(true);
    const pdfResponse = await getAcademicRecord(student.usuario_id);
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return icon ? (
    <ButtonIcon
      tooltip="Historial académico"
      icon={<FileDoneOutlined />}
      color="blue"
      onClick={handleOnClickReportCard}
      tooltipPlacement="top"
      loading={loading}
    />
  ) : (
    <ButtonCustom
      color="primary"
      onClick={handleOnClickReportCard}
      fullWidth
      icon={<FileDoneOutlined />}
      loading={loading}
      disabled={loading}
    >
      Historial académico
    </ButtonCustom>
  );
};
