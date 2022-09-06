import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";
import { defaultColumn, columnProps } from "../../../shared/columns";
import { ButtonIcon } from "../../../shared/components";
import { StopOutlined, UserAddOutlined } from "@ant-design/icons";

export default ({ periods, groupId }) => {
  const filteredColumns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (student) => {
        return (
          <ButtonIcon
            tooltip="Agregar al grupo"
            icon={<UserAddOutlined />}
            color="blue"
            onClick={() => handleOnAddStudent(student)}
            tooltipPlacement="top"
          />
        );
      },
    },
    defaultColumn("CURP", "username"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Apellido Paterno", "primer_apellido"),
    defaultColumn("Apellido Materno", "segundo_apellido"),
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Correo", "email"),
  ];

  const addedColumns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (student) => {
        return (
          <ButtonIcon
            tooltip="Quitar del grupo"
            icon={<StopOutlined />}
            color="volcano"
            onClick={() => handleOnDeleteStudent(student)}
            tooltipPlacement="top"
          />
        );
      },
    },
    defaultColumn("CURP", "username"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Apellido Paterno", "primer_apellido"),
    defaultColumn("Apellido Materno", "segundo_apellido"),
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Correo", "email"),
  ];
  const filteredStudents = useSelector(
    (state) => state.groupsReducer.filteredStudents
  );
  const addedStudents = useSelector(
    (state) => state.groupsReducer.addedStudents
  );

  const handleOnDeleteStudent = (student) => {
    console.log(student);
  };

  const handleOnAddStudent = (student) => {
    console.log(student);
  };
  useEffect(() => {
    async function setUp() {
      console.log(periods, groupId);
    }
    setUp();
  });
  return (
    <>
      <h4>Alumnos filtrados</h4>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {filteredStudents.length}
      </p>
      <Table
        rowKey="username"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={filteredColumns}
        scroll={{ x: filteredColumns.length * 200 }}
        dataSource={filteredStudents}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {filteredStudents.length}
      </p>
      <br />
      <br />
      <h4>Alumnos agregados</h4>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {addedStudents.length}
      </p>
      <Table
        rowKey="username"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={addedColumns}
        scroll={{ x: addedColumns.length * 200 }}
        dataSource={addedStudents}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {addedStudents.length}
      </p>
    </>
  );
};
