import React, { useState } from "react";
import { ButtonCustom, ButtonIcon } from "../shared/components";
import { ProfileOutlined, FileProtectOutlined } from "@ant-design/icons";
import { studentGradesList } from "../service/TeacherService";

const PrintStudentGradesList = ({ groupPeriodId, groupIntersemestralId, groupSemestralId, groupExtraId, teacherAssigmentId, plantelId, CareerUacId, periodoCursoId, iconMode = true, textBtn}) => {
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    let data = {
      docente_asignacion_id: teacherAssigmentId,
      plantel_id: plantelId,
      grupo_recursamiento_intersemestral_id: groupIntersemestralId,
      grupo_periodo_id: groupPeriodId,
      grupo_recursamiento_semestral_id: groupSemestralId,
      grupo_extraordinario_id: groupExtraId,
      carrera_uac_id: CareerUacId,
      periodo_curso_id: periodoCursoId
    }
    const pdfResponse = await studentGradesList(data);
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };


  


  return iconMode ? (
    <ButtonIcon
      tooltip="Acta de calificaciones"
      icon={<FileProtectOutlined />}
      color="green"
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
      {textBtn}
    </ButtonCustom>
  );
};

export default PrintStudentGradesList;
