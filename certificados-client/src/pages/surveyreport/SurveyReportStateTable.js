import React from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";

import Columns, { columnProps } from "../../shared/columns";
import { stringCompare } from "../../shared/functions";

export default function SurveyReportCountryTable({ dataset,surveyTipo }) {
  const columns = [
    {
      ...columnProps,
      title: "Plantel",
      sorter: (a, b) => stringCompare(a, b, "cct"),
      render: (row) => {
        return (
          <Link to={`/Reportes/Plantel/${row.schoolId}/${surveyTipo}`}>
            {row.cct} - {row.schoolName}
          </Link>
        );
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
        rowKey="schoolId"
        bordered
        columns={columns}
        dataSource={dataset}
        size="small"
      />
    </>
  );
}
