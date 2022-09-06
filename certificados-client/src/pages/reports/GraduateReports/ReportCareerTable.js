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
  Columns.tit_m,
  Columns.tit_h,
  Columns.egr_m,
  Columns.egr_h,
  {...columnProps,title: "Total hombres",render: (row) => {return <label >{row.suma_h}</label>;},},
  {...columnProps,title: "Total mujeres",render: (row) => {return <label >{row.suma_m}</label>;},}
];
export default function ReportCareerTable({ dataset }) {
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