import React from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";
import {
  FileUnknownOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { ButtonIconLink } from "../../../shared/components";
import { defaultColumn, columnProps } from "../../../shared/columns";
import EditGroupPeriod from "./EditGroupPeriod";
import DisableGroup from "./DisableGroup";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import TableOptionDropDown from "../../../components/TableOptionDropDown";
import ReportsModal from "./ReportsModal";
import GenerateStudentsIdFromGroupPeriod from "./GenerateStudentsIdFromGroupPeriod";

export default () => {
  const groups = useSelector(
    (store) => store.groupsPeriodsReducer.groupsPeriodList
  );
  const period = useSelector((store) => store.permissionsReducer.period);
  const columns = [
    {
      ...columnProps,
      title: "CCT",
      render: (group) => {
        return <span>{group.plantel_carrera.plantel.cct}</span>;
      },
    },
    {
      ...columnProps,
      title: "Plantel",
      render: (group) => {
        return <span>{group.plantel_carrera.plantel.nombre}</span>;
      },
    },
    {
      ...columnProps,
      title: "Carrera",
      render: (group) => {
        return <span>{group.plantel_carrera.carrera.nombre}</span>;
      },
    },
    {
      ...columnProps,
      title: "Clave carrera",
      render: (group) => {
        return <span>{group.plantel_carrera.carrera.clave_carrera}</span>;
      },
    },
    defaultColumn("Grupo", "grupo"),
    defaultColumn("Semestre", "semestre"),
    defaultColumn("Turno", "turno"),
    {
      ...columnProps,
      title: "Alumnos inscritos",
      render: (group) => (
        <>
          {group.alumnos_count}/{group.max_alumnos}
        </>
      ),
    },
    {
      ...columnProps,
      title: "Opciones",
      render: (group) => {
        return (
          <>
            <PermissionValidator
              permissions={[permissionList.EDITAR_GRUPO_PERIODO]}
            >
              <EditGroupPeriod groupData={group} />
            </PermissionValidator>
            {period.id === group.periodo_id && (
              <PermissionValidator
                permissions={[
                  permissionList.CONFIGURAR_FECHA_INSCRIPCION_POR_GRUPO,
                ]}
              >
                <ButtonIconLink
                  tooltip="Configuración de inscripción"
                  icon={<SettingOutlined />}
                  color="geekblue"
                  link={`/Grupos-Periodos/Configuracion-de-Inscripcion/${group.id}`}
                  tooltipPlacement="top"
                />
              </PermissionValidator>
            )}
            <ReportsModal group={group} />
            <TableOptionDropDown>
              <GenerateStudentsIdFromGroupPeriod groupPeriod={group} />
              <PermissionValidator
                permissions={[permissionList.AGREGAR_OPTATIVAS_A_GRUPO_PERIODO]}
              >
                {group.semestre === 6 &&
                  group.plantel_carrera.carrera.tipo_perfil_id !== 3 && (
                    <ButtonIconLink
                      tooltip="Agregar optativas"
                      icon={<FileUnknownOutlined />}
                      color="geekblue"
                      link={`/Grupos-Periodos/Optativas/${group.id}`}
                      tooltipPlacement="top"
                    />
                  )}
              </PermissionValidator>
              {period.id === group.periodo_id && (
                <ButtonIconLink
                  tooltip="Cambiar alumnos de grupo"
                  icon={<UserSwitchOutlined />}
                  color="volcano"
                  link={`/Grupos-Periodos/Cambiar-Alumnos-De-Grupo/${group.id}`}
                  tooltipPlacement="top"
                />
              )}
              {period.id === group.periodo_id && (
                <PermissionValidator
                  permissions={[permissionList.INSCRIBIR_ALUMNOS_A_GRUPO]}
                >
                  <ButtonIconLink
                    tooltip="Inscribir alumnos"
                    icon={<UsergroupAddOutlined />}
                    color="blue"
                    link={`/Grupos-Periodos/Agregar-Alumnos-Regulares/${group.id}`}
                    tooltipPlacement="top"
                  />
                </PermissionValidator>
              )}
              <PermissionValidator
                permissions={[permissionList.ELIMINAR_GRUPO_PERIODO]}
              >
                <DisableGroup groupData={group} />
              </PermissionValidator>
            </TableOptionDropDown>
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
