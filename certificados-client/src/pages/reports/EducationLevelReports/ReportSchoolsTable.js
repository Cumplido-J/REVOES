import React from "react";
import { Table } from "antd";

import Columns, { columnProps } from "../../../shared/columns";

export default function ReportSchoolTable(props) {
  const {datasetSchools, onClickPlantel} = props;
  const columns = [
    {
      ...columnProps,
      title: "Plantel",
      render: (row) => {
        return <a href="#" onClick={()=>onClickPlantel(row.plantel_id)}>{row.plantel}</a>;
        return <label >{row.plantel_id}</label>;
      },
    },
    {
      ...columnProps,
      title: "CCT",
      render: (row) => {
        return <label >{row.cct}</label>;
      },
    },
    {
      ...columnProps,
      title: "Ciclo",
      render: (row) => {
        return <label >{row.ciclo}</label>;
      },
    },
    {...columnProps,title: "doctorado mujeres",render: (row) => {return <label >{row.doc_m}</label>;},},
    {...columnProps,title: "doctorado hombres",render: (row) => {return <label >{row.doc_h}</label>;},},
    {...columnProps,title: "maestria mujeres",render: (row) => {return <label >{row.mia_m}</label>;},},
    {...columnProps,title: "maestria hombres",render: (row) => {return <label >{row.mia_h}</label>;},},
    {...columnProps,title: "especialización mujeres",render: (row) => {return <label >{row.esp_m}</label>;},},
    {...columnProps,title: "especialización hombres",render: (row) => {return <label >{row.esp_h}</label>;},},
    {...columnProps,title: "licenciatura mujeres",render: (row) => {return <label >{row.lic_m}</label>;},},
    {...columnProps,title: "licenciatura hombres",render: (row) => {return <label >{row.lic_h}</label>;},},
    {...columnProps,title: "superior mujeres",render: (row) => {return <label >{row.sup_m}</label>;},},
    {...columnProps,title: "superior hombres",render: (row) => {return <label >{row.sup_h}</label>;},},
    {...columnProps,title: "de maestro mujeres",render: (row) => {return <label >{row.mto_m}</label>;},},
    {...columnProps,title: "de maestro hombres",render: (row) => {return <label >{row.mto_h}</label>;},},
    {...columnProps,title: "bachillerato mujeres",render: (row) => {return <label >{row.bac_m}</label>;},},
    {...columnProps,title: "bachillerato hombres",render: (row) => {return <label >{row.bac_h}</label>;},},
    {...columnProps,title: "técnico mujeres",render: (row) => {return <label >{row.tec_m}</label>;},},
    {...columnProps,title: "técnico hombres",render: (row) => {return <label >{row.tec_h}</label>;},},
    {...columnProps,title: "comercial mujeres",render: (row) => {return <label >{row.com_m}</label>;},},
    {...columnProps,title: "comercial hombres",render: (row) => {return <label >{row.com_h}</label>;},},
    {...columnProps,title: "secundaria mujeres",render: (row) => {return <label >{row.sec_m}</label>;},},
    {...columnProps,title: "secundaria hombres",render: (row) => {return <label >{row.sec_h}</label>;},},
    {...columnProps,title: "primaria mujeres",render: (row) => {return <label >{row.pia_m}</label>;},},
    {...columnProps,title: "primaria hombres",render: (row) => {return <label >{row.pia_h}</label>;},},
  ];
  return (
    <>
      <Table
        style={{ marginTop: "1em" , overflow: "scroll" }}
        pagination={false}
        bordered
        rowKey="id"
        columns={columns}
        dataSource={datasetSchools}
        size="small"
      />
    </>
  );
}