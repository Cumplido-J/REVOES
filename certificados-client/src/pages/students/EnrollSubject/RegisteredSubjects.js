import React, { useState } from "react";
import { Table } from "antd";
import { defaultColumn } from "../../../shared/columns";

const columns = [
  defaultColumn("Materia", "name"),
  defaultColumn("Semestre", "semester"),
  defaultColumn("Grupo", "group"),
  defaultColumn("Turno", "shift"),
];

export default ({ subjects }) => {
  return (
    <>
      <h6>Materias registradas</h6>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={subjects}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {subjects.length}
      </p>
    </>
  );
};
