import React, { useState } from "react";
import { ButtonCustom, ButtonIcon } from "../../../shared/components";
import { ProfileOutlined } from "@ant-design/icons";
import StudentService from "../../../service/StudentService";

const DocumentProof = ({ student, icon = true }) => {
  const [loading, setLoading] = useState(false);
  const handleOnClickReportCard = async () => {
    setLoading(true);
    const pdfResponse = await StudentService.studentReportCard(
      student.usuario_id
    );
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return icon ? (
    <ButtonIcon
      tooltip="Boleta de calificaciones"
      icon={<ProfileOutlined />}
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
      icon={<ProfileOutlined />}
      loading={loading}
      disabled={loading}
    >
      Boleta de calificaciones
    </ButtonCustom>
  );
};
export default DocumentProof;
