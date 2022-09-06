import React from "react";
import { Link } from "react-router-dom";
import { Table,Typography } from "antd";

import Columns, { columnProps } from "../../shared/columns";
import { stringCompare } from "../../shared/functions";
const { Text} = Typography;
const columns = [
  {
    ...columnProps,
    title: "Plantel",
    sorter: (a, b) => stringCompare(a, b, "cct"),
    render: (row) => {
      return (
        <Link to={`/Certified/Plantel/${row.schoolId}/${row.generation}`}>
          {row.cct} - {row.schoolName}
        </Link>
      );
    },
  },
  Columns.totalFinised,
  Columns.totalPartial,
  Columns.totalAbrogado
];
export default function CertifiedReportStateTable({ dataset, total }) {
  return (
    <>
      <Table
        style={{ marginTop: "1em" }}
        pagination={false}
        rowKey="stateId"
        bordered
        columns={columns}
        dataSource={dataset}
        size="small"
      />
      <DivTable name={"Total"} value={" "} />
      <DivTable name={"Termino"} value={total.totalTermino} /> 
      <DivTable name={"Parciales"} value={total.totalParcial} /> 
      <DivTable name={"Abrogados"} value={total.totalAbrogado} /> 
    </>
  );
}

function DivTable({ name, value }) {
  return (
    <>
      <div className="form-group col-md-3">
        <Text strong>{name}:</Text> <Text>{value}</Text>
      </div>
    </>
  );
}