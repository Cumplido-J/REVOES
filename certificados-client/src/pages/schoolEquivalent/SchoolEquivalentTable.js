import React, { useState } from "react";
import { PlusSquareOutlined, UnorderedListOutlined, EyeOutlined, Modal, EyeInvisibleOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { ButtonIconLink, ButtonIcon } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import PermissionValidator from "../../components/PermissionValidator";
import { permissionList } from "../../shared/constants";
import SchoolEquivalentModal from "./SchoolEquivalentModal";
import SchoolEquivalentData from "./SchoolEquivalentData";

const columns = (toggleModal, toggleData, state) => [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      if (row.equivalent === true) {
        return (
          <>
            <ButtonIcon
              onClick={() => toggleModal(row.idschool)}
              tooltip="Lista de carreras" icon={<UnorderedListOutlined />} color="green"
            />
            {"  |  "}
            <PermissionValidator permissions={[permissionList.AGREGAR_PLANTELES]}>
              <ButtonIconLink onClick={() => toggleData(row.idschool)}
                tooltip="Vista Equivalencia" icon={<EyeOutlined />} color="green" link="#"
              />
            </PermissionValidator>

          </>
        );
      } else {
        return (
          <>
            <ButtonIcon
              onClick={() => toggleModal(row.idschool)}
              tooltip="Lista de carreras" icon={<UnorderedListOutlined />} color="green" />
            {"  |  "}
            <ButtonIcon tooltip="No tiene Equivalencia" icon={<EyeInvisibleOutlined />} color="black" />
          </>
        );
      }

    },
  },
  {
    ...columnProps,
    title: <PlusSquareOutlined />,
    width: "15px",
    render: (row) => {
      return (
        <>
          <PermissionValidator permissions={[permissionList.AGREGAR_PLANTELES]}>
            <ButtonIconLink
              tooltip="Agregar Equivalencia"
              icon={<PlusSquareOutlined />}
              color="blue"
              link={`/PlantelesEquivalentes/Add/${row.idschool}/${row.stateId}`}
            />
          </PermissionValidator>

        </>
      );
    },
  },
  Columns.cct,
  Columns.name,
  Columns.namecertificate,
  Columns.city,
  Columns.schoolType,
  {
    ...columnProps,
    title: "Estatus de operación",
    sorter: (a, b) => a.status - b.status,
    render: (row) => {
      return (
        <>
          {row.status === 0 && (
            <p>No operando</p>
          )}
          {row.status === 1 && (
            <p>Operando</p>
          )}
        </>
      );
    },
  },
];

export default function SchoolEquivalentTable({ dataset, state }) {
  const [cct, setCct] = useState(null);
  const [school, setSchool] = useState(null);
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <Table
        rowKey="cct"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns(setCct, setSchool, state)}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        size="small"
      />
      <p>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <SchoolEquivalentModal cct={cct} setCct={setCct} />
      <SchoolEquivalentData school={school} setSchool={setSchool} />
    </>
  );
}
