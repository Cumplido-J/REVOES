import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { Table } from "antd";
import Columns, { columnProps } from "../../shared/columns";
import { ButtonIconLink } from "../../shared/components";
const columns = [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      return (
        <ButtonIconLink
          tooltip="Editar"
          icon={<EditOutlined />}
          color="green"
          link={`/Usuarios/Editar/${row.username}`}
        />
      );
    },
  },
  Columns.username,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  Columns.status,
  Columns.state,
  Columns.schoolName,
];

export default function UserSearchTable({ dataset }) {
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <Table
        rowKey="username"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        size="small"
      />
      <p>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
    </>
  );
}
