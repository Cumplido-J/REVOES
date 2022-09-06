import React from "react";
import { Table } from "antd";

import Columns, { columnProps } from "../../../shared/columns";
const columns = [
  Columns.cct,
  {
    ...columnProps,
    title: "Plantel",
    render: (row) => {
      return <label >{row.plantel}</label>;
    },
  },
  {
    ...columnProps,
    title: "Plaza",
    render: (row) => {
      return <label >{row.plaza}</label>;
    },
  },
  {
    ...columnProps,
    title: "Turno",
    render: (row) => {
      return <label >{row.turno}</label>;
    },
  },
  {...columnProps,title: "doctorado titulado mujeres",render: (row) => {return <label >{row.doc_t_m}</label>;},},
  {...columnProps,title: "doctorado estudios concluidos mujeres",render: (row) => {return <label >{row.doc_ec_m}</label>;},},
  {...columnProps,title: "doctorado estudios sin concluir mujeres",render: (row) => {return <label >{row.doc_es_m}</label>;},},
  {...columnProps,title: "doctorado titulado hombres",render: (row) => {return <label >{row.doc_t}</label>;},},
  {...columnProps,title: "doctorado estudios concluidos hombres",render: (row) => {return <label >{row.doc_ec}</label>;},},
  {...columnProps,title: "doctorado estudios sin concluir hombres",render: (row) => {return <label >{row.doc_es}</label>;},},
  {...columnProps,title: "maestría titulado mujeres",render: (row) => {return <label >{row.mia_t_m}</label>;},},
  {...columnProps,title: "maestría estudios concluidos mujeres",render: (row) => {return <label >{row.mia_ec_m}</label>;},},
  {...columnProps,title: "maestría estudios sin concluir mujeres",render: (row) => {return <label >{row.mia_es_m}</label>;},},
  {...columnProps,title: "maestría titulado hombres",render: (row) => {return <label >{row.mia_t}</label>;},},
  {...columnProps,title: "maestría estudios concluidos hombres",render: (row) => {return <label >{row.mia_ec}</label>;},},
  {...columnProps,title: "maestría estudios sin concluir hombres",render: (row) => {return <label >{row.mia_es}</label>;},},
  {...columnProps,title: "especialización titulado mujeres",render: (row) => {return <label >{row.esp_t_m}</label>;},},
  {...columnProps,title: "especialización estudios concluidos mujeres",render: (row) => {return <label >{row.esp_ec_m}</label>;},},
  {...columnProps,title: "especialización estudios sin concluir mujeres",render: (row) => {return <label >{row.esp_es_m}</label>;},},
  {...columnProps,title: "especialización titulado hombres",render: (row) => {return <label >{row.esp_t}</label>;},},
  {...columnProps,title: "especialización estudios concluidos hombres",render: (row) => {return <label >{row.esp_ec}</label>;},},
  {...columnProps,title: "especialización estudios sin concluir hombres",render: (row) => {return <label >{row.esp_es}</label>;},},
  {...columnProps,title: "licenciatura titulado mujeres",render: (row) => {return <label >{row.lic_t_m}</label>;},},
  {...columnProps,title: "licenciatura estudios concluidos mujeres",render: (row) => {return <label >{row.lic_ec_m}</label>;},},
  {...columnProps,title: "licenciatura estudios sin concluir mujeres",render: (row) => {return <label >{row.lic_es_m}</label>;},},
  {...columnProps,title: "licenciatura titulado hombres",render: (row) => {return <label >{row.lic_t}</label>;},},
  {...columnProps,title: "licenciatura estudios concluidos hombres",render: (row) => {return <label >{row.lic_ec}</label>;},},
  {...columnProps,title: "licenciatura estudios sin concluir hombres",render: (row) => {return <label >{row.lic_es}</label>;},},
  {...columnProps,title: "superior titulado mujeres",render: (row) => {return <label >{row.sup_t_m}</label>;},},
  {...columnProps,title: "superior estudios concluidos mujeres",render: (row) => {return <label >{row.sup_ec_m}</label>;},},
  {...columnProps,title: "superior estudios sin concluir mujeres",render: (row) => {return <label >{row.sup_es_m}</label>;},},
  {...columnProps,title: "superior titulado hombres",render: (row) => {return <label >{row.sup_t}</label>;},},
  {...columnProps,title: "superior estudios concluidos hombres",render: (row) => {return <label >{row.sup_ec}</label>;},},
  {...columnProps,title: "superior estudios sin concluir hombres",render: (row) => {return <label >{row.sup_es}</label>;},},
  {...columnProps,title: "de maestros titulado mujeres",render: (row) => {return <label >{row.mto_t_m}</label>;},},
  {...columnProps,title: "de maestros estudios concluidos mujeres",render: (row) => {return <label >{row.mto_ec_m}</label>;},},
  {...columnProps,title: "de maestros estudios sin concluir mujeres",render: (row) => {return <label >{row.mto_es_m}</label>;},},
  {...columnProps,title: "de maestros titulado hombres",render: (row) => {return <label >{row.mto_t}</label>;},},
  {...columnProps,title: "de maestros estudios concluidos hombres",render: (row) => {return <label >{row.mto_ec}</label>;},},
  {...columnProps,title: "de maestros estudios sin concluir hombres",render: (row) => {return <label >{row.mto_es}</label>;},},
  {...columnProps,title: "bachillerato titulado mujeres",render: (row) => {return <label >{row.bac_t_m}</label>;},},
  {...columnProps,title: "bachillerato estudios concluidos mujeres",render: (row) => {return <label >{row.bac_ec_m}</label>;},},
  {...columnProps,title: "bachillerato estudios sin concluir mujeres",render: (row) => {return <label >{row.bac_es_m}</label>;},},
  {...columnProps,title: "bachillerato titulado hombres",render: (row) => {return <label >{row.bac_t}</label>;},},
  {...columnProps,title: "bachillerato estudios concluidos hombres",render: (row) => {return <label >{row.bac_ec}</label>;},},
  {...columnProps,title: "bachillerato estudios sin concluir hombres",render: (row) => {return <label >{row.bac_es}</label>;},},
  {...columnProps,title: "técnico titulado mujeres",render: (row) => {return <label >{row.tec_t_m}</label>;},},
  {...columnProps,title: "técnico estudios concluidos mujeres",render: (row) => {return <label >{row.tec_ec_m}</label>;},},
  {...columnProps,title: "técnico estudios sin concluir mujeres",render: (row) => {return <label >{row.tec_es_m}</label>;},},
  {...columnProps,title: "técnico titulado hombres",render: (row) => {return <label >{row.tec_t}</label>;},},
  {...columnProps,title: "técnico estudios concluidos hombres",render: (row) => {return <label >{row.tec_ec}</label>;},},
  {...columnProps,title: "técnico estudios sin concluir hombres",render: (row) => {return <label >{row.tec_es}</label>;},},
  {...columnProps,title: "comercial titulado mujeres",render: (row) => {return <label >{row.com_t_m}</label>;},},
  {...columnProps,title: "comercial estudios concluidos mujeres",render: (row) => {return <label >{row.com_ec_m}</label>;},},
  {...columnProps,title: "comercial estudios sin concluir mujeres",render: (row) => {return <label >{row.com_es_m}</label>;},},
  {...columnProps,title: "comercial titulado hombres",render: (row) => {return <label >{row.com_t}</label>;},},
  {...columnProps,title: "comercial estudios concluidos hombres",render: (row) => {return <label >{row.com_ec}</label>;},},
  {...columnProps,title: "comercial estudios sin concluir hombres",render: (row) => {return <label >{row.com_es}</label>;},},
  {...columnProps,title: "secundaria titulado mujeres",render: (row) => {return <label >{row.sec_t_m}</label>;},},
  {...columnProps,title: "secundaria estudios concluidos mujeres",render: (row) => {return <label >{row.sec_ec_m}</label>;},},
  {...columnProps,title: "secundaria estudios sin concluir mujeres",render: (row) => {return <label >{row.sec_es_m}</label>;},},
  {...columnProps,title: "secundaria titulado hombres",render: (row) => {return <label >{row.sec_t}</label>;},},
  {...columnProps,title: "secundaria estudios concluidos hombres",render: (row) => {return <label >{row.sec_ec}</label>;},},
  {...columnProps,title: "secundaria estudios sin concluir hombres",render: (row) => {return <label >{row.sec_es}</label>;},},
  {...columnProps,title: "primaria titulado mujeres",render: (row) => {return <label >{row.pia_t_m}</label>;},},
  {...columnProps,title: "primaria estudios concluidos mujeres",render: (row) => {return <label >{row.pia_ec_m}</label>;},},
  {...columnProps,title: "primaria estudios sin concluir mujeres",render: (row) => {return <label >{row.pia_es_m}</label>;},},
  {...columnProps,title: "primaria titulado hombres",render: (row) => {return <label >{row.pia_t}</label>;},},
  {...columnProps,title: "primaria estudios concluidos hombres",render: (row) => {return <label >{row.pia_ec}</label>;},},
  {...columnProps,title: "primaria estudios sin concluir hombres",render: (row) => {return <label >{row.pia_es}</label>;},},
];
export default function ReportSchoolTable({ datasetSchool }) {
  return (
    <>
      <Table
        style={{ marginTop: "1em" , overflow: "scroll" }}
        pagination={false}
        bordered
        rowKey="id"
        columns={columns}
        dataSource={datasetSchool}
        size="small"
      />
    </>
  );
}