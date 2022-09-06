import React, { useState } from "react";
import { IdcardOutlined } from "@ant-design/icons";
import { ButtonIcon } from "../../../shared/components";
import StudentService from "../../../service/StudentService";

const GenerateStudentId = ({ groupPeriod }) => {
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const pdfResponse = await StudentService.generateStudentIdsByGroupPeriod(
      groupPeriod.id
    );
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };

  return groupPeriod.alumnos_count ? (
    <ButtonIcon
      tooltip="Generar credencial de estudiantes"
      icon={<IdcardOutlined />}
      color="blue"
      onClick={handleOnClick}
      tooltipPlacement="top"
      loading={loading}
    />
  ) : (
    <></>
  );
};
export default GenerateStudentId;
