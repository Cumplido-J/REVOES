import React, { useState } from "react";
import { ButtonCustom } from "../../../shared/components";
import { ContainerOutlined } from "@ant-design/icons";
import { semiannualEvaluationReport } from "../../../service/GroupsPeriodService";

const SemiannualEvaluationReport = ({ groupPeriodId }) => {
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const blob = await semiannualEvaluationReport(groupPeriodId);
    if (blob?.success) {
      const fileUrl = URL.createObjectURL(blob.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return (
    <ButtonCustom
      icon={<ContainerOutlined />}
      onClick={handleOnClick}
      loading={loading}
    >
      Evaluación semestral
    </ButtonCustom>
  );
};

export default SemiannualEvaluationReport;
