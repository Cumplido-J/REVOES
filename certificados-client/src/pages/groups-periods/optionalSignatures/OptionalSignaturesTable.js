import React from "react";
import { useDispatch } from "react-redux";
import { addNewOptionalSignature } from "../../../reducers/groups-periods/actions/addNewOptionalSignature";
import { removeOptionalSignature } from "../../../reducers/groups-periods/actions/removeOptionalSignature";
import { defaultColumn, columnProps } from "../../../shared/columns";
import { ButtonIcon } from "../../../shared/components";
import { DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import { Table, Typography } from "antd";
const { Title } = Typography;
export default ({ signatures, isSelected, loading }) => {
  const dispatch = useDispatch();
  const columns = [
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Clave", "clave_uac"),
    defaultColumn("Horas", "horas"),
    defaultColumn("Creditos", "creditos"),
    {
      ...columnProps,
      title: "Opciones",
      render: (signature) => {
        return isSelected ? (
          <ButtonIcon
            tooltip="Remover"
            icon={<DeleteOutlined />}
            color="volcano"
            onClick={() => handleRemove(signature)}
            tooltipPlacement="top"
          />
        ) : (
          <ButtonIcon
            tooltip="Agregar"
            icon={<CheckOutlined />}
            color="green"
            onClick={() => handleAdd(signature)}
            tooltipPlacement="top"
          />
        );
      },
    },
  ];
  const handleAdd = (signature) => {
    dispatch(addNewOptionalSignature(signature));
  };
  const handleRemove = (signature) => {
    dispatch(removeOptionalSignature(signature));
  };
  return (
    <>
      <Title level={2}>
        Optativas {isSelected ? "Agregadas" : "Disponibles"}
      </Title>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {signatures.length}
      </p>
      <Table
        loading={loading}
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={signatures}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {signatures.length}
      </p>
    </>
  );
};
