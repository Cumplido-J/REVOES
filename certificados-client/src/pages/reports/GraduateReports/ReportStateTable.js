import React from "react";
import { Table } from "antd";

import Columns, { columnProps } from "../../../shared/columns";

export default function ReportStateTable(props) {
  const {dataset, onClickEstado} = props;
  const columns = [
    {
      ...columnProps,
      title: "Entidad",
      render: (row) => {
        return <a href="#" onClick={()=>onClickEstado(row.idEntidad)}>{row.entidad}</a>;
      },
    },
    Columns.num_plantel,
    Columns.titulados,
    Columns.egresados,
  ];
  return (
    <>
      <Table
        style={{ marginTop: "1em", overflow: "scroll" }}
        pagination={false}
        rowKey="idEntidad"
        bordered
        columns={columns}
        dataSource={dataset}
        size="small"
      />
    </>
  );
}