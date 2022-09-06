import React, { useEffect, useState } from "react";
import { Table, Modal, Tabs } from "antd";
import { Descriptions } from "antd";
import moment from "moment";
import TableAsignaturasRecursamientoIntersemestral from "../asignaturas/TableAsignaturasRecursamientoIntersemestral";
import TableAsignaturas from "../asignaturas/TableAsignaturas";

export default ({ subjects, visible, onOk, onCancel }) => {
  const [assignment, setAssignment] = useState({});
  const [assignmentAsignatura, setAssignmentAsignatura] = useState({});
  const [assignmentInterSemester, setAssignmentInterSemester] = useState({});
  const [assignmentSemestral, setAssignmentSemestral] = useState({});
  
  const setUp = async () => {
    setAssignment(subjects);
    if(subjects?.docente_asignatura) {
      setAssignmentAsignatura(subjects?.docente_asignatura?.map((s) => {
        return {
          ...s,
          id: s.id,
          periodo_id: s.periodo.id,
          periodo_name: s.periodo.nombre_con_mes,
          semestre: s.carrera_uac.semestre,
          grupo: s.grupo_periodo.grupo,
          carrera_clave: s.carrera_uac.carrera.clave_carrera,
          carrera_name: s.carrera_uac.carrera.nombre,
          carrera_description: `${s.carrera_uac.carrera.clave_carrera} - ${s.carrera_uac.carrera.nombre}`,
          uac_clave: s.carrera_uac.uac.clave_uac,
          uac_name: s.carrera_uac.uac.nombre,
          uac_description: `${s.carrera_uac.uac.clave_uac} - ${s.carrera_uac.uac.nombre}`,
        }
      }));
    }
   /*  if(subjects?.asignatura_recursamiento_intersemestral) {
      setAssignmentInterSemester(subjects?.asignatura_recursamiento_intersemestral?.map((s) => {
        return {
          ...s,
          periodo_name: s.periodo.nombre_con_mes,
          periodo_id: s.periodo.id,
          semestre: s.carrera_uac.semestre,
          grupo: s.grupo_periodo.grupo,
          carrera_clave: s.carrera_uac.carrera.clave_carrera,
          carrera_name: s.carrera_uac.carrera.nombre,
          carrera_description: `${s.carrera_uac.carrera.clave_carrera} - ${s.carrera_uac.carrera.nombre}`,
          uac_clave: s.carrera_uac.uac.clave_uac,
          uac_name: s.carrera_uac.uac.nombre,
          uac_description: `${s.carrera_uac.uac.clave_uac} - ${s.carrera_uac.uac.nombre}`,
        }
      }));
    }
    if(subjects?.grupo_recursamiento_semestral) {
      setAssignmentSemestral(subjects?.grupo_recursamiento_semestral?.map((s) => {
        return {
          ...s,
          periodo_name: s.periodo.nombre_con_mes,
          periodo_id: s.periodo.id,
          semestre: s.carrera_uac.semestre,
          grupo: s.grupo_periodo.grupo,
          carrera_clave: s.carrera_uac.carrera.clave_carrera,
          carrera_name: s.carrera_uac.carrera.nombre,
          carrera_description: `${s.carrera_uac.carrera.clave_carrera} - ${s.carrera_uac.carrera.nombre}`,
          uac_clave: s.carrera_uac.uac.clave_uac,
          uac_name: s.carrera_uac.uac.nombre,
          uac_description: `${s.carrera_uac.uac.clave_uac} - ${s.carrera_uac.uac.nombre}`,
        }
      }));
    } */
  };
  useEffect(() => {
    setUp();
  }, [subjects]);

  return (
    <Modal
      title="Asignaturas"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={1250}
      style={{ top: 20 }}
      footer={null}
    >
      <fieldset>
        <Descriptions>
          <Descriptions.Item labelStyle={{ style: { color: "red" } }} label="Estado">{assignment.estado_plantel}</Descriptions.Item>
          <Descriptions.Item labelStyle={{ style: { color: "red" } }} label="Municipio">{assignment.municipio_plantel}</Descriptions.Item>
          <Descriptions.Item labelStyle={{ style: { color: "red" } }} label="Centro">{assignment.nombre_plantel}</Descriptions.Item>
          <Descriptions.Item labelStyle={{ style: { color: "red" } }} label="Tipo de Plaza">{assignment.tipo_plaza_nombre}</Descriptions.Item>
          <Descriptions.Item labelStyle={{ style: { color: "red" } }} label="Horas"> {assignment.horas}</Descriptions.Item>
          <Descriptions.Item labelStyle={{ style: { color: "red" } }} label="Fecha de asignación"> {assignment.fecha_asignacion}</Descriptions.Item>
          <Descriptions.Item labelStyle={{ style: { color: "red" } }} label="Fecha de inicio"> {assignment.fecha_inicio_contrato}</Descriptions.Item>
          <Descriptions.Item labelStyle={{ style: { color: "red" } }} label="Fecha de fin">{" "}
            {assignment.fecha_fin_contrato != null
              ? moment.isMoment(assignment.fecha_fin_contrato)
                ? assignment.fecha_fin_contrato.format("YYYY-MM-DD")
                : assignment.fecha_fin_contrato
              : "En curso"}{" "}</Descriptions.Item>
          <Descriptions.Item labelStyle={{ style: { color: "red" } }} label="Estatus de la asignación"> {assignment.plantilla_estatus == 1 ? "Activo" : "Terminado"}</Descriptions.Item>
        </Descriptions>

        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Asignaturas" key="1">
            <TableAsignaturas asignaturas={assignmentAsignatura} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="Intersemestrales" key="2">
            <TableAsignaturasRecursamientoIntersemestral asignaturas_recursamiento={assignmentInterSemester} tipoRecursamiento={2} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Semestrales" key="3">
            <TableAsignaturasRecursamientoIntersemestral asignaturas_recursamiento={assignmentSemestral} tipoRecursamiento={1} />
          </Tabs.TabPane> */}
        </Tabs>
      </fieldset>
    </Modal>
  );
};
