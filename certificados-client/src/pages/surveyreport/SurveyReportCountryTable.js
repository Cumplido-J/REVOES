import React from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";

import Columns, { columnProps } from "../../shared/columns";


export default function SurveyReportCountryTable({ dataset,surveyTipo }) {
  const columns = [
    {
      ...columnProps,
      title: "Estado de la república",
      render: (row) => {
        return <Link to={`/Reportes/Estatal/${row.stateId}/${surveyTipo} `}>{row.stateName}</Link>;
      },
    },
    Columns.totalSurveys,
    Columns.totalStudents,
    Columns.percentage,
  ];  
  
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
    </>
  );
}
