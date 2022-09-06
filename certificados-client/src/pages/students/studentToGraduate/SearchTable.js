import { Checkbox, Table } from "antd";
import React from "react";
import PermissionValidator from "../../../components/PermissionValidator";
import { columnProps, defaultColumn } from "../../../shared/columns";
import { permissionList } from "../../../shared/constants";
import AcademicRecord from "../studentSearch/AcademicRecord";
import ShowStudentModules from "./ShowStudentModules";

const SearchTable = ({ students, loading, onSelect, readOnly = false }) => {
  const columns = [
    {
      ...columnProps,
      title: "Selección",
      render: (student) => {
        return student.tipo_alumno === "Regular" ? (
          <>
            <Checkbox checked={student.selected} onChange={onSelect(student)} />
          </>
        ) : null;
      },
    },
    {
      ...columnProps,
      title: "Opciones",
      render: (student) => {
        return (
          <>
            <PermissionValidator permissions={[permissionList.GENERAR_BOLETAS]}>
              <AcademicRecord student={student} />
            </PermissionValidator>
            <ShowStudentModules modules={student.modules} />
          </>
        );
      },
    },
    defaultColumn("CURP", "curp"),
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer apellido", "lastname1"),
    defaultColumn("Segundo apellido", "lastname2"),
    defaultColumn("Semestre", "semester"),
    defaultColumn("Carrera", "career"),
    defaultColumn("Tipo de alumno", "tipo_alumno"),
    defaultColumn("Generación", "generacion"),
    defaultColumn("Periodo inicio", "periodo_inicio"),
    defaultColumn("Periodo termino", "periodo_termino"),
    defaultColumn("Tipo trayectoria", "tipo_trayectoria"),
  ];

  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {students.length}
      </p>
      <Table
        rowKey="usuario_id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={!readOnly ? columns : columns.slice(1)}
        scroll={{ x: columns.length * 200 }}
        dataSource={students}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {students.length}
      </p>
    </>
  );
};

export default SearchTable;
