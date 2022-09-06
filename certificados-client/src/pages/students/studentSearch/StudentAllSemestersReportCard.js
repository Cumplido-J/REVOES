import React, { useState } from "react";
import { ButtonCustom } from "../../../shared/components";
import { FileSyncOutlined } from "@ant-design/icons";
import StudentService from "../../../service/StudentService";

const SemiannualEvaluationReport = ({ studentId }) => {
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const blob = await StudentService.studentAllSemestersReportCard(studentId);
    if (blob?.success) {
      const fileUrl = URL.createObjectURL(blob.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return (
    <ButtonCustom
      icon={<FileSyncOutlined />}
      onClick={handleOnClick}
      loading={loading}
      fullWidth
    >
      Boleta de calificaciones de todos los semestres
    </ButtonCustom>
  );
};

export default SemiannualEvaluationReport;
