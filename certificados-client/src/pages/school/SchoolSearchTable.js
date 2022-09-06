import React, { useState } from "react";
import { EditOutlined, FileProtectOutlined,EyeOutlined, Modal  } from "@ant-design/icons";
import { Table } from "antd";
import { ButtonIconLink,ButtonIcon } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import PermissionValidator from "../../components/PermissionValidator";
import { permissionList } from "../../shared/constants";
import SchoolSerchCareer from "./SchoolSerchCareer";

const columns  = (toggleModal) => [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      return (
        <>
          <PermissionValidator permissions={[permissionList.AGREGAR_PLANTELES]}>
            <ButtonIconLink
              tooltip="Editar"
              icon={<EditOutlined />}
              color="green"
              link={`/Planteles/Editar/${row.cct}`}
            />
          </PermissionValidator>
          <PermissionValidator
            permissions={[permissionList.CONFIGURACION_DE_EVALUACIONES]}
          >
            <ButtonIconLink
              tooltip="Configuración"
              icon={<FileProtectOutlined />}
              color="blue"
              link={`/Planteles/Evaluaciones/${row.cct}`}
            />
                      </PermissionValidator>
            <ButtonIcon
              onClick={() => toggleModal(row.idschool)}
              tooltip="Lista de carreras"
              icon={<EyeOutlined />}
              color="red"  
            />

        </>
      );
    },
  },
  Columns.cct,
  Columns.name,
  Columns.namecertificate,
  Columns.city,
  Columns.schoolType,
  Columns.sinemsDate,
  {
    ...columnProps,
    title: "Estatus de operación",
    sorter: (a, b) => a.status - b.status,
    render: (row) => {
      return (
        <>
        {row.status ===0  && ( 
        <p>No operando</p>
        )}
        {row.status ===1  && ( 
        <p>Operando</p>
        )}
        </>
      );
    },
  },
];

export default function SchoolSearchTable({ dataset }) {
  const [cct, setCct] = useState(null);
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <Table
        rowKey="cct"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns(setCct)}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        size="small"
      />
      <p>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <SchoolSerchCareer  cct={cct} setCct={setCct} />
    </>
  );
}
