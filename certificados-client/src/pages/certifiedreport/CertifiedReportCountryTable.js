import React from "react";
import { Link } from "react-router-dom";
import { Table, Typography } from "antd";
import Columns, { columnProps } from "../../shared/columns";

const { Text} = Typography;
const columns = [
  {
    ...columnProps,
    title: "Estado de la república",
    render: (row) => {
      return <Link to={`/Certified/Estatal/${row.stateId}/${row.generation}`}>{row.stateName}</Link>;
    },
  },
    Columns.totalFinised,
    Columns.totalPartial,
    Columns.totalAbrogado
];

export default function CertifiedReportCountryTable({ dataset }) {

  const sumaT= dataset.reduce((prev, next) => prev + next.totalFinised, 0);
  const sumaP= dataset.reduce((prev, next) => prev + next.totalPartial, 0);
  const sumaA= dataset.reduce((prev, next) => prev + next.totalAbrogado, 0);
    return <>
        <Table
            style={{ marginTop: "1em" }}
            pagination={false}
            rowKey="stateId"
            bordered
            columns={columns}
            dataSource={dataset}
            size="small" />
            <DivTable name={"Total"} value={" "} />
            <DivTable name={"Termino"} value={sumaT} />
            <DivTable name={"Parciales"} value={sumaP} />
            <DivTable name={"Abrogados"} value={sumaA} />
    </>
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