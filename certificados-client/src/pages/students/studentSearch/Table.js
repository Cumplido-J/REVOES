import React from "react";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { columnProps, defaultColumn } from "../../../shared/columns";
import { Table } from "antd";
import { useSelector } from "react-redux";
import { ButtonIconLink } from "../../../shared/components";
import WithdrawStuden from "./WithdrawStuden";
import ChangeGroup from "./ChangeGroup";
import DeleteStudent from "./DeleteStudent";
import RemoveStudentFromGroup from "./RemoveStudentFromGroup";
import TableOptionDropDown from "../../../components/TableOptionDropDown";
import StudentDocumentsModal from "./StudentDocumentsModal/StudentDocumentsModal";

export default () => {
  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (student) => {
        return (
          <>
            <>
              <ButtonIconLink
                tooltip="Editar información del alumno"
                icon={<EditOutlined />}
                color="geekblue"
                link={`/Estudiantes/${student.usuario.username}`}
                tooltipPlacement="top"
              />
              <ButtonIconLink
                tooltip="Ver información del alumno"
                icon={<EyeOutlined />}
                color="blue"
                link={`/Estudiantes/Detalles/${student.usuario.username}`}
                tooltipPlacement="top"
              />
              <StudentDocumentsModal student={student} />
              <TableOptionDropDown>
                {student.estatus_inscripcion === "Activo" && (
                  <>
                    <RemoveStudentFromGroup student={student} />
                    <WithdrawStuden student={student} />
                    <ChangeGroup student={student} />
                  </>
                )}
                <DeleteStudent student={student} />
              </TableOptionDropDown>
            </>
          </>
        );
      },
    },
    defaultColumn("Matrícula", "matricula"),
    {
      ...columnProps,
      title: "CURP",
      render: (student) => {
        return <>{student?.usuario?.username}</>;
      },
    },
    defaultColumn("Primer apellido", "primer_apellido", { preSort: true }),
    defaultColumn("Segundo apellido", "segundo_apellido"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Semestre", "semestre"),
    {
      ...columnProps,
      title: "Grupo",
      render: (student) => {
        if (
          Array.isArray(student.grupos) &&
          student.grupos[0] &&
          student.grupos[0]
        ) {
          return (
            <>
              {student.grupos[0].semestre} {student.grupos[0].grupo}
            </>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      ...columnProps,
      title: "Carrera",
      render: (student) => {
        return (
          <>
            {student?.carrera?.clave_carrera} - {student?.carrera?.nombre}
          </>
        );
      },
    },
    defaultColumn("Generación", "generacion"),
    defaultColumn("Tipo de alumno", "tipo_alumno"),
    defaultColumn("Tipo trayectoria", "tipo_trayectoria"),
    defaultColumn("Estatus inscripción", "estatus_inscripcion"),
  ];
  const studentsSearchTable = useSelector(
    (store) => store.studentsReducer.studentsSearchTable
  );
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {studentsSearchTable.length}
      </p>
      <Table
        rowKey="usuario_id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={studentsSearchTable}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {studentsSearchTable.length}
      </p>
    </>
  );
};
