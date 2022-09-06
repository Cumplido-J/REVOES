import React, { useState }from "react";
import { Table } from "antd";
import { CheckSquareOutlined,EyeOutlined } from "@ant-design/icons";

import Columns, { columnProps } from "../../shared/columns";
import {ButtonIcon } from "../../shared/components";
import SurveyShowAnswer from "./SurveyShowAnswer";
const columns = (toggleModal) =>[
  {
    ...columnProps,
    title: "Respuestas",
    render: (row) => {
      if (row.answered === true) 
      return (
        <ButtonIcon onClick={() => toggleModal(row.curp)} 
        tooltip="Ver respuestas" 
        icon={<CheckSquareOutlined />} 
        color="green" />
      );
      else return "";
    }
  },   
  Columns.curp,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  {
    ...columnProps,
    title: "Contestó",
    render: (row) => (row.answered === false ? "No" : "Si"),
    defaultSortOrder: "descend",
    sorter: (a, b) => a.answered.toString().localeCompare(b.answered.toString()),
  },

];
export default function SurveyReportSchoolTable({ dataset, surveyType }) {
  const [curp, setCurp] = useState(null);
  return (
    <>
      <Table style={{ marginTop: "1em" }} 
      rowKey="curp" 
      bordered 
      columns={columns(setCurp)} 
      scroll={{ x: columns.length * 300 }} 
      dataSource={dataset} 
      size="small" />
      <SurveyShowAnswer curp={curp} setCurp={setCurp} surveyType={surveyType}/>
    </>
  );
}
