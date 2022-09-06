import React, { useState } from "react";
import { ButtonCustom, ButtonIcon } from "../../../shared/components";
import { RobotOutlined } from "@ant-design/icons";
import { groupPeriodTeacherReport } from "../../../service/GroupsPeriodService";

const ShowTeachersStatisticsByGroupPeriod = ({
  groupPeriodId,
  iconMode = true,
}) => {
  const [loading, setLoading] = useState(false);

  const handleShow = async () => {
    setLoading(true);
    const pdfResponse = await groupPeriodTeacherReport(groupPeriodId);
    if (pdfResponse && pdfResponse.success) {
      const fileurl = URL.createObjectURL(pdfResponse.data);
      window.open(fileurl);
    }
    setLoading(false);
  };

  return iconMode ? (
    <ButtonIcon
      onClick={handleShow}
      tooltip="Reporte de docentes"
      tooltipPlacement="top"
      color="gold"
      icon={<RobotOutlined />}
      loading={loading}
    />
  ) : (
    <ButtonCustom
      icon={<RobotOutlined />}
      onClick={handleShow}
      loading={loading}
    >
      Reporte de docentes
    </ButtonCustom>
  );
};

export default ShowTeachersStatisticsByGroupPeriod;
