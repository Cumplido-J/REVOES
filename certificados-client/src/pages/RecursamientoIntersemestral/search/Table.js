import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { ButtonIconLink, ButtonIcon } from "../../../shared/components";
import { defaultColumn, columnProps } from "../../../shared/columns";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import { setIntersemestralList } from "../../../reducers/intersemestralReducer/actions/setIntersemestralList";
import DeleteIntersemestral from "../actionsTable/DeleteIntersemestral";
import PrintStudentGradesList from "../../../components/PrintStudentGradesList";
import ReportsModal from "./ReportsModal";


export default () => {
  const currentPeriod = useSelector(
    (store) => store.permissionsReducer.period
  );
  const perrmisionsUser = useSelector(
    (store) => store.permissionsReducer.permissions
  );
  const _isMounted = useRef(true); // Initial value _isMounted = true
  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);
  const intersemestral = useSelector((store) => store.intersemestralReducer.intersemestralList);
  const curseType = useSelector((store) => store.intersemestralReducer.curseTypeSelected);
  if (_isMounted.current) {
    // Check always mounted component
    // continue treatment of AJAX response... ;
  }

  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (data) => {
        /*TODO: Set margins*/
        return (
          <>
            <PermissionValidator permissions={[permissionList.VER_DETALLES_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL]}>
              {/* edit / view info */}
              {/* {(currentPeriod.id === data.periodo || perrmisionsUser.includes('Nacional') || perrmisionsUser.includes('Estatal')) && ( */}
                <ButtonIconLink
                  tooltip="Detalles"
                  icon={<EyeOutlined />}
                  color="green"
                  style={{ margin: 5 }}
                  link={curseType === 2 ? `/Docentes/Asignatura-Recursamiento-Intersemestral/${data.id}` : curseType === 1 ? `/Docentes/Asignatura-Recursamiento-Semestral/${data.id}` : curseType === 3 ? `/Docentes/Examen-Extraordinario/${data.id}` : ``}
                />
              {/* )} */}
            </PermissionValidator>
            <PermissionValidator permissions={[permissionList.EDITAR_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL]}>
              {/* edit / view info */}
              {/* {(currentPeriod.id === data.periodo || perrmisionsUser.includes('Nacional') || perrmisionsUser.includes('Estatal')) && ( */}
                <ButtonIconLink
                  tooltip="Editar"
                  icon={<EditOutlined />}
                  color="blue"
                  style={{ margin: 5 }}
                  link={curseType === 2 ? `/Recursamiento-Intersemestral/Editar/${data.id}` : curseType === 1 ? `/Recursamiento-Semestral/Editar/${data.id}` : curseType === 3 ? `/Examen-Extraordinario/Editar/${data.id}` : ``}
                />
              {/* )} */}
            </PermissionValidator>
            <PermissionValidator
              permissions={[permissionList.ELIMINAR_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL]}
            >
              {/* {(currentPeriod.id === data.periodo || perrmisionsUser.includes('Nacional') || perrmisionsUser.includes('Estatal')) && ( */}
                <DeleteIntersemestral intersemestral={data.id} tipoRecursamiento={curseType} />
              {/* )} */}
            </PermissionValidator>
            {
              curseType === 2 ?
                <PrintStudentGradesList
                  groupSemestralId={!data.grupo_recursamiento_intersemestral_id ? data.id : null}
                  groupIntersemestralId={data.grupo_recursamiento_intersemestral_id}
                  teacherAssigmentId={data.plantilla_docente_id}
                  plantelId={data.plantel_id}
                  CareerUacId={data.carrera_uac_id}
                />
                :
                curseType === 1 ? <ReportsModal grupo={data} /> :
                curseType === 3 ? <PrintStudentGradesList
                  teacherAssigmentId={data.plantilla_docente_id}
                  plantelId={data.plantel_id}
                  groupExtraId={data.id}
                  CareerUacId={data.carrera_uac_id}
                  periodoCursoId={data.periodo_id}
                /> : null
            }
          </>
        );
      },
    },
    //defaultColumn("Plantel", "plantel_nombre"),
    defaultColumn("Asignatura", "asignatura_nombre"),
    defaultColumn("Carrera", "carrera_nombre"),
    defaultColumn("Semestre", "semestre"),
    defaultColumn("Grupo", "grupo"),
    defaultColumn("Periodo", "nombre_periodo"),
    defaultColumn("Docente", "docente_nombre"),
  ];

  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {intersemestral.length}
      </p>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={intersemestral}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {intersemestral.length}
      </p>
    </>
  );
};
