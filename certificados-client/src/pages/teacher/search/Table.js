import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import AltaTeacher from "../actionsTable/AltaTeacher";
import BajaTeacher from "../actionsTable/BajaTeacher";
import { ButtonIconLink } from "../../../shared/components";
import { defaultColumn, columnProps } from "../../../shared/columns";
import { TeacherStatus } from "../../../shared/catalogs";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";

export default () => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);
  const teachers = useSelector((store) => store.teachersReducer.teachersList);
  if (_isMounted.current) {
    // Check always mounted component
    // continue treatment of AJAX response... ;
  }

  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (teacher) => {
        /*TODO: Set margins*/
        return (
          <>
            <PermissionValidator permissions={[permissionList.EDITAR_DOCENTE]}>
              {/* edit / view info */}
              <ButtonIconLink
                tooltip="Editar/Ver"
                icon={<EditOutlined />}
                color="geekblue"
                style={{ margin: 5 }}
                link={`/Docentes/Editar/${teacher.id}`}
              />
            </PermissionValidator>
            <PermissionValidator
              permissions={[permissionList.DESACTIVAR_DOCENTE]}
            >
              {teacher.docente_estatus === TeacherStatus.ACTIVO && (
                /* baja del docente */
                <BajaTeacher docente={teacher} />
              )}
            </PermissionValidator>
            <PermissionValidator
              permissions={[permissionList.REINGRESO_DE_DOCENTE]}
            >
              {teacher.docente_estatus === TeacherStatus.BAJA && (
                /* reactivar / reingreso */
                <AltaTeacher docente={teacher} />
              )}
            </PermissionValidator>

            {/*  {(teacher.docente_estatus === TeacherStatus.ACTIVO ||
              teacher.docente_estatus ===
                TeacherStatus.BAJA_PERMISO_ACTIVO) && (
              <BajaPermiso docente={teacher} />
            )} */}
          </>
        );
      },
    },
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer Apellido", "primer_apellido"),
    defaultColumn("Segundo Apellido", "segundo_apellido"),
    defaultColumn("CURP", "curp"),
    defaultColumn("Cédula", "cedula"),
    defaultColumn("Teléfono", "telefono"),
    defaultColumn("Fecha Ingreso", "fecha_ingreso"),
    defaultColumn("Estatus", "estatus"),
  ];
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {teachers.length}
      </p>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={teachers}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {teachers.length}
      </p>
    </>
  );
};
