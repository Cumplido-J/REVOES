import React, { useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";
import { ButtonIcon } from "../../../shared/components";
import { printApplicantReceipt } from "../../../service/ApplicantsService";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
const PrintReceiptButton = ({ applicant }) => {
  const [loading, setLoading] = useState(false);
  const handlePrint = async () => {
    setLoading(true);
    const response = await printApplicantReceipt(applicant?.id);
    if (response?.success) {
      window.open(URL.createObjectURL(response?.data));
    }
    setLoading(false);
  };
  return (
    <PermissionValidator
      permissions={[
        permissionList.IMPRIMIR_COMPROBANTE_DE_INSCRIPCION_ASPIRANTES,
      ]}
    >
      <ButtonIcon
        tooltip="Imprimir comprobante de inscripción"
        color="info"
        icon={<PrinterOutlined />}
        tooltipPlacement="top"
        onClick={handlePrint}
        loading={loading}
        disabled={!applicant?.correo}
      />
    </PermissionValidator>
  );
};

export default PrintReceiptButton;
