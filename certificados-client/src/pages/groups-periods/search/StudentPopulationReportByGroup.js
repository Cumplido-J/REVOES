import React, { useState } from "react";
import { ButtonCustom } from "../../../shared/components";
import { TeamOutlined } from "@ant-design/icons";
import { studentPopulationReportByGroups } from "../../../service/GroupsPeriodService";
import { useSelector } from "react-redux";

const StudentPopulationReportByGroup = ({ groupsIds = null }) => {
  const searchResults = useSelector(
    (store) => store.groupsPeriodsReducer.groupsPeriodList
  );
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const pdfResponse = await studentPopulationReportByGroups(
      groupsIds ?? searchResults.map(({ id }) => id)
    );
    if (pdfResponse?.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return (
    <ButtonCustom
      fullWidth={!groupsIds}
      icon={<TeamOutlined />}
      onClick={handleClick}
      loading={loading}
      disabled={groupsIds ? false : !searchResults.length}
    >
      {groupsIds
        ? "Reporte de población de alumnos por grupo"
        : "Reporte de población de alumnos por busqueda"}
    </ButtonCustom>
  );
};

export default StudentPopulationReportByGroup;
