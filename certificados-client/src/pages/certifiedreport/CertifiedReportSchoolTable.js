import React from "react";
import { Table } from "antd";
import { CheckSquareOutlined } from "@ant-design/icons";

import Columns, { columnProps } from "../../shared/columns";
import { ButtonIconLink } from "../../shared/components";
import { formattedDate } from "../../shared/functions";
const columns = [
  Columns.schoolName,
  Columns.careerName,
  Columns.curp,
  Columns.enrollmentKey,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  Columns.folioNumber,
  Columns.typeCertified,
  Columns.generation,
  Columns.timbrado,
  Columns.inicio,
  Columns.termino

];
export default function CertifiedReportSchoolTable({ dataset }) {
  return (
    <>
      <Table style={{ marginTop: "1em" }} 
      rowKey="curp" 
      bordered 
      columns={columns} scroll={{ x: columns.length * 300 }} 
      dataSource={dataset.students} 
      size="small" 
        />       
    </>
  );
}
