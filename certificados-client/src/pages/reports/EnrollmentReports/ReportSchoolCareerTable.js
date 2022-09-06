import React from "react";
import { Table } from "antd";

import Columns, { columnProps } from "../../../shared/columns";
const columns = [
  {
    ...columnProps,
    title: "Carrera",
    render: (row) => {
      return <label >{row.nombre}</label>;
    },
  },
  Columns.num_grupos,
  Columns.semestre,
  Columns.num_m,
  Columns.num_h,
  Columns.turno
];
export default function ReportSchoolCareerTable({ dataset }) {
  return (
    <>
      <Table
        style={{ marginTop: "1em", overflow: "scroll" }}
        pagination={false}
        bordered
        rowKey="id"
        columns={columns}
        dataSource={dataset}
        size="small"
      />
    </>
  );
}