import React from "react";
import { Table } from "antd";
import { defaultColumn, columnProps } from "../../../shared/columns";
import ApproveBtn from "./ApproveBtn";
import UnapproveBtn from "./UnapproveBtn";

export default ({groups = [], loading=false}) => {
  const columns = [
    defaultColumn("Semestre", "semestre"),
    defaultColumn("Grupo", "grupo"),
    defaultColumn("Turno", "turno"),
    defaultColumn("Tipo", "accion"),
    {
      ...columnProps,
      title: "Plantel",
      render: (group) => <>{group.plantel_carrera.plantel.nombre}</>,
    },
    {
      ...columnProps,
      title: "CCT",
      render: (group) => <>{group.plantel_carrera.plantel.cct}</>,
    },
    {
      ...columnProps,
      title: "Carrera",
      render: (group) => <>{group.plantel_carrera.carrera.nombre}</>,
    },
    defaultColumn("Max alumnos", "max_alumnos"),
    {
      ...columnProps,
      title: "Periodo",
      render: (group) => (
        <>
          {group && group.periodo && group.periodo.nombre
            ? group.periodo.nombre
            : ""}
        </>
      ),
    },
    {
      ...columnProps,
      title: "Opciones",
      render: (group) => {
        return (
          <>
            <ApproveBtn groupData={group} />
            <UnapproveBtn groupData={group} />
          </>
        );
      },
    },
  ];
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {groups.length}
      </p>
      <Table
        loading={loading}
        rowKey={(row) => `${row.id}-${row.accion}-${row.url}`}
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={groups}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {groups.length}
      </p>
    </>
  );
};
