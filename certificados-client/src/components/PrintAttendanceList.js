import React, { useState } from "react";
import { ButtonCustom, ButtonIcon } from "../shared/components";
import { ProfileOutlined } from "@ant-design/icons";
import { attendanceList } from "../service/GroupsPeriodService";

const PrintAttendanceList = ({
  groupPeriodId,
  teacherUacId = false,
  iconMode = true,
}) => {
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    const pdfResponse = await attendanceList(groupPeriodId, teacherUacId);
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };

  return iconMode ? (
    <ButtonIcon
      tooltip="Lista de asistencia"
      icon={<ProfileOutlined />}
      color="blue"
      onClick={handleOnClick}
      tooltipPlacement="top"
      loading={loading}
    />
  ) : (
    <ButtonCustom
      icon={<ProfileOutlined />}
      onClick={handleOnClick}
      loading={loading}
    >
      Lista de asistencia
    </ButtonCustom>
  );
};

export default PrintAttendanceList;
