import React from "react";
import { Table } from "antd";

import Columns, { columnProps } from "../../../shared/columns";
export default function ReportSchoolTable(props) {
  const {dataset, onClickPlantel} = props;
  const columns = [
    {
      ...columnProps,
      title: "Plantel",
      render: (row) => {
        return <a href="#" onClick={()=>onClickPlantel(row.id)}>{row.nombre}</a>;
      },
    },
    {
      ...columnProps,
      title: "Suma titulados",
      render: (row) => {
        return <label >{row.suma_titulados}</label>;
      },
    },
    {
      ...columnProps,
      title: "Suma egresados",
      render: (row) => {
        return <label >{row.suma_egresados}</label>;
      },
    }
  ];
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