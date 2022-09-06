import React, { useState } from "react";
import { ButtonCustom } from "../../../shared/components";
import { FileOutlined } from "@ant-design/icons";
import { groupPeriodRedi } from "../../../service/GroupsPeriodService";

const PrintRediByGroup = ({ groupPeriodId }) => {
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const pdfResponse = await groupPeriodRedi(groupPeriodId);
    if (pdfResponse?.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return (
    <ButtonCustom
      icon={<FileOutlined />}
      onClick={handleOnClick}
      loading={loading}
    >
      REDI
    </ButtonCustom>
  );
};

export default PrintRediByGroup;
