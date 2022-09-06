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
    {
      ...columnProps,
      title: "Total Doctorado",
      render: (row) => {
        return <label >{row.sumDoc}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total Maestría",
      render: (row) => {
        return <label >{row.sumMia}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total Especialización",
      render: (row) => {
        return <label >{row.sumEsp}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total Licenciatura",
      render: (row) => {
        return <label >{row.sumLic}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total Superior",
      render: (row) => {
        return <label >{row.sumSup}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total de Maestro.",
      render: (row) => {
        return <label >{row.sumMto}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total Bachillerato",
      render: (row) => {
        return <label >{row.sumBac}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total Técnico",
      render: (row) => {
        return <label >{row.sumTec}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total Comercial",
      render: (row) => {
        return <label >{row.sumCom}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total Secundaria",
      render: (row) => {
        return <label >{row.sumSec}</label>;
      },
    },
    {
      ...columnProps,
      title: "Total Primaria",
      render: (row) => {
        return <label >{row.sumPia}</label>;
      },
    },
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