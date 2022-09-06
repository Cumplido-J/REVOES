import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Descriptions, Tabs } from "antd";
import PermissionValidator from "../../../components/PermissionValidator";
import TableAsignaturas from "../asignaturas/TableAsignaturas";
import TableAsignaturasRecursamientoIntersemestral from "../asignaturas/TableAsignaturasRecursamientoIntersemestral";
import TableAsignaturasRecursamientoSemestral from "../asignaturas/TableAsignaturasRecursamientoSemestral";
import { permissionList } from "../../../shared/constants";

export default () => {
  const asignacion = useSelector((store) => store.asignacionReducer.asignacion);
  return (
    <>
      <fieldset>
        <Descriptions style={{ fontWeight: "bold" }}>
          <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Docente">{asignacion.docente}</Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Estado">{asignacion.estado_nombre}</Descriptions.Item>
          <Descriptions.Item style={{ fontWeight: "bold" }} label="Municipio">{asignacion.municipio_nombre}</Descriptions.Item>
          <Descriptions.Item style={{ fontWeight: "bold" }} label="Centro">{asignacion.plantel}</Descriptions.Item>
          <Descriptions.Item style={{ fontWeight: "bold" }} label="Tipo de Plaza">{asignacion.tipo_plaza}</Descriptions.Item>
          <Descriptions.Item style={{ fontWeight: "bold" }} label="Horas"> {asignacion.horas}</Descriptions.Item>
          <Descriptions.Item style={{ fontWeight: "bold" }} label="Fecha de asignación"> {asignacion.asignacion_contrato}</Descriptions.Item>
          <Descriptions.Item style={{ fontWeight: "bold" }} label="Fecha de inicio"> {asignacion.inicio_contrato}</Descriptions.Item>
          <Descriptions.Item style={{ fontWeight: "bold" }} label="Fecha de fin"> {asignacion.fin_contrato}</Descriptions.Item>
          <Descriptions.Item style={{ fontWeight: "bold" }} label="Estatus de la asignación"> {asignacion.estatus_asignacion}</Descriptions.Item>
        </Descriptions>

        {/* <p>ASIGNATURAS:</p> */}
        <PermissionValidator
          permissions={[permissionList.VER_ASIGNACIONES_DE_DOCENTE]}
        >
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Asignaturas" key="1">
              <TableAsignaturas />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Intersemestral" key="2">
              <TableAsignaturasRecursamientoIntersemestral />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Semestrales" key="3">
              <TableAsignaturasRecursamientoSemestral />
            </Tabs.TabPane>
          </Tabs>
        </PermissionValidator>
      </fieldset>
    </>
  );
};
