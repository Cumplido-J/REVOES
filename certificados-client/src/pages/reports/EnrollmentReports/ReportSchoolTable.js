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
    Columns.num_grupos,
    Columns.num_m,
    Columns.num_h 
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