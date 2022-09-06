import React, { useMemo } from "react";
import { ButtonCustom } from "../../../../shared/components";
import { PieChartOutlined } from "@ant-design/icons";
import useStudentPopulationReport from "./useStudentPopulationReport";
const StudentPopulationReport = () => {
  const [generateReport, loading, studentsIds] = useStudentPopulationReport();
  const disabled = useMemo(
    () => !studentsIds || !studentsIds.length,
    [studentsIds]
  );
  return (
    <ButtonCustom
      icon={<PieChartOutlined />}
      fullWidth
      onClick={generateReport}
      disabled={disabled || loading}
      loading={loading}
    >
      Reporte de población
    </ButtonCustom>
  );
};

export default StudentPopulationReport;
