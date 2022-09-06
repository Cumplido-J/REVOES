import React, { useState } from "react";
import { ButtonCustom } from "../../../shared/components";
import { RadarChartOutlined } from "@ant-design/icons";
import { semiannualConcentratedReport } from "../../../service/GroupsPeriodService";

const SemiannualConcentratedReport = ({ groupPeriodId }) => {
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const blob = await semiannualConcentratedReport(groupPeriodId);
    if (blob?.success) {
      const fileUrl = URL.createObjectURL(blob.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return (
    <ButtonCustom
      icon={<RadarChartOutlined />}
      onClick={handleOnClick}
      loading={loading}
    >
      Concentrado semestral
    </ButtonCustom>
  );
};

export default SemiannualConcentratedReport;
