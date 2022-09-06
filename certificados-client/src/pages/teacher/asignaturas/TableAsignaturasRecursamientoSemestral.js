import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { defaultColumn, columnProps } from "../../../shared/columns";
import {
  EyeOutlined,
} from "@ant-design/icons";
import { ButtonIconLink } from "../../../shared/components";
import { Form, Table, } from "antd";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import PrintStudentGradesList from "../../../components/PrintStudentGradesList";
import ReportsModal from "./ReportsModal";


export default () => {
  const currentPeriod = useSelector(
    (store) => store.permissionsReducer.period
  );
  const perrmisionsUser = useSelector(
    (store) => store.permissionsReducer.permissions
  );
  const asignaturasRecursamientoSemestral = useSelector(
    (store) => store.asignaturaRecursamientoIntersemestralDocenteReducer.asignaturasRecursamientoSemestralList
  )


  const columnsAsignaturas = [
    {
      ...columnProps,
      title: "Opciones",
      render: (data) => {
        return (
          <>
           <PermissionValidator permissions={[permissionList.VER_DETALLES_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL]}>
            {(currentPeriod.id === data.periodo || perrmisionsUser.includes('Nacional') || perrmisionsUser.includes('Estatal')) && (
                <ButtonIconLink
                  tooltip="Ver Más"
                  icon={<EyeOutlined />}
                  color="green"
                  tooltipPlacement="top"
                  link={`/Docentes/Asignatura-Recursamiento-Semestral/${data.id}`}
                />
             )} 
            </PermissionValidator>
              <ReportsModal grupo={data} />
          </>
        );
      },
    },
    defaultColumn("Periodo", "periodo_name"),
    defaultColumn("Semestre", "semestre"),
    defaultColumn("Grupo", "grupo"),
    defaultColumn("Asignatura", "uac_description"),
    defaultColumn("Carrera", "carrera_description"),
  ];

  return (
    <>
      <fieldset>
        <PermissionValidator
          permissions={[permissionList.VER_ASIGNATURAS_DE_DOCENTE]}
        >
          <Table
            rowKey="id"
            bordered
            pagination={{ position: ["topLeft", "bottomLeft"] }}
            columns={columnsAsignaturas}
            scroll={{ x: columnsAsignaturas.length * 200 }}
            dataSource={asignaturasRecursamientoSemestral}
            size="small"
          />
        </PermissionValidator>
      </fieldset>
    </>
  );
};
