import React from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import DisableGroup from "./DisableGroup";
import EnableForPeriod from "./EnableForPeriod";
import { volcano, green } from "@ant-design/colors";
import { ButtonIconLink } from "../../../shared/components";
import { defaultColumn, columnProps } from "../../../shared/columns";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";

export default () => {
  const groups = useSelector((store) => store.groupsReducer.groupsList);
  const columns = [
    defaultColumn("Grupo", "grupo"),
    defaultColumn("Semestre", "semestre"),
    {
      ...columnProps,
      title: "Carrera",
      render: (group) => {
        const { nombre, clave_carrera } = group.plantel_carrera.carrera;
        return (
          <span>
            {clave_carrera}-{nombre}
          </span>
        );
      },
    },
    defaultColumn("Turno", "turno"),
    {
      ...columnProps,
      title: "Estatus",
      render: (group) => {
        const status = group.status === "activo";
        return (
          <span
            style={{
              color: status ? green.primary : volcano.primary,
            }}
          >
            {group.status}
          </span>
        );
      },
    },
    {
      ...columnProps,
      title: "Opciones",
      render: (group) => {
        return (
          <>
            <PermissionValidator permissions={[permissionList.EDITAR_GRUPO]}>
              <ButtonIconLink
                tooltip="Editar"
                icon={<EditOutlined />}
                color="geekblue"
                link={`/Grupos/Editar/${group.id}`}
                tooltipPlacement="top"
              />
            </PermissionValidator>
            <PermissionValidator permissions={[permissionList.ELIMINAR_GRUPO]}>
              <DisableGroup groupData={group} />
            </PermissionValidator>
            <PermissionValidator permissions={[permissionList.ACTIVAR_GRUPO]}>
              <EnableForPeriod groupData={group} />
            </PermissionValidator>
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
        rowKey="id"
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
