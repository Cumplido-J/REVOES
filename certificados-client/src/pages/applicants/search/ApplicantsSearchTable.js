import useGetApplicants from "./hooks/useGetApplicants";
import { Table } from "antd";
import React from "react";
import { columnProps, defaultColumn } from "../../../shared/columns";
import ApplicantsEditButton from "../edit/ApplicantsEditButton";
import ApplicantsDeleteButton from "../components/ApplicantsDelete/ApplicantsDeleteButton";
import PromoteApplicantLink from "../components/PromoteApplicantLink/PromoteApplicantLink";
import PrintReceiptButton from "../printReceipt/PrintReceiptButton";

const ApplicantsSearchTable = () => {
  const [applicants, loadingApplicants] = useGetApplicants();
  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (applicant) => {
        return (
          <>
            <ApplicantsEditButton applicantId={applicant?.id} />
            <PrintReceiptButton applicant={applicant} />
            <PromoteApplicantLink applicantId={applicant?.id} />
            <ApplicantsDeleteButton applicantData={applicant} />
          </>
        );
      },
    },
    defaultColumn("Primer apellido", "primer_apellido", { preSort: true }),
    defaultColumn("Segundo apellido", "segundo_apellido"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("CURP", "curp"),
    defaultColumn("Teléfono", "telefono"),
    defaultColumn("Fecha de nacimiento", "fecha_nacimiento"),
    defaultColumn("Correo electrónico", "correo"),
  ];
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {applicants.length}
      </p>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={applicants}
        size="small"
        loading={loadingApplicants}
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {applicants.length}
      </p>
    </>
  );
};

export default ApplicantsSearchTable;
