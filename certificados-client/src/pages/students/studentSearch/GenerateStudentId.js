import React, { useState } from "react";
import { IdcardOutlined } from "@ant-design/icons";
import { ButtonCustom, ButtonIcon } from "../../../shared/components";
import StudentService from "../../../service/StudentService";

const GenerateStudentId = ({ student, icon = true }) => {
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const pdfResponse = await StudentService.generateStudentIdById(
      student.usuario_id
    );
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  const showButton = () => {
    return Array.isArray(student?.grupos) && student.grupos[0];
  };
  return /* showButton() ? */ (
    icon ? (
      <ButtonIcon
        tooltip="Generar credencial de estudiante"
        icon={<IdcardOutlined />}
        color="blue"
        onClick={handleOnClick}
        tooltipPlacement="top"
        loading={loading}
      />
    ) : (
      <ButtonCustom
        color="primary"
        onClick={handleOnClick}
        fullWidth
        icon={<IdcardOutlined />}
        loading={loading}
        disabled={loading}
      >
        Generar credencial de estudiante
      </ButtonCustom>
    )
  ) /* : (
    <></>
  ); */
};
export default GenerateStudentId;
