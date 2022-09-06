import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { ButtonIconLink } from "../../../shared/components";
import Columns, { columnProps } from "../../../shared/columns";
const columns = [
  Columns.curp,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  Columns.enrollmentKey,
  Columns.generation,
  Columns.cct,
  Columns.schoolName,
  Columns.careerName,
  Columns.carrerKey,
];

export default function StudentMasiveLoadTable({ dataset }) {
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Excel con  {dataset.length} registros: </strong> 
      </p>
      <Table
        rowKey="curp"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        size="small"
      />
    </>
  );
}
