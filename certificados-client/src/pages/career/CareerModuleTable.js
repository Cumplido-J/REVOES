import React, {useEffect, useState } from "react";
import { EditOutlined,CheckCircleOutlined } from "@ant-design/icons";
import { Table,Col,Row, Space} from "antd";
import {ButtonCustom, ButtonIcon } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import PermissionValidator from "../../components/PermissionValidator";
import { permissionList } from "../../shared/constants";
import ModalDelete from "./ModalDelete";
import { userHasRole } from "../../shared/functions";

const columnsEnding = (editButton) => [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      return (
        <>
          <PermissionValidator permissions={[permissionList.AGREGAR_CARRERAS]}>

            <ButtonIcon 
                onClick={() => editButton(row.id)}
                color="green"
                tooltip="Editar registro"
                icon={<EditOutlined />}
            />
          </PermissionValidator>
        </>
      ); 
    },
  },
  Columns.module,
  Columns.order,
  Columns.credits,
  Columns.hours,
]; 

export default function CareerModuleTable({ dataset, rowSelection, deleteModule,selectedRowKeys, userProfile, editButton}) {

  const [modalFielVisible, setModalFielVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);

  const toggleModalFiel = () => {
    setModalFielVisible(!modalFielVisible);
  };

  useEffect(() => {
    setColumns(columnsEnding(editButton));
  }, []);

  return (
    <>
    <Row align="center">
      <Space>
        <Col>
        {(userHasRole.dev(userProfile.roles)) && (
          <ButtonCustom
            tooltip="Eliminar competencias"
            color="gold"
            fullWidth
            disabled={selectedRowKeys.length === 0}
            onClick={toggleModalFiel}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            Eliminar competencias
          </ButtonCustom>   
          )}      
        </Col>
      </Space>
    </Row>    
      <p style={{ marginTop: "2em" }}> 
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        //columns={columns}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        rowSelection={rowSelection}
        size="small"
      />
      <p>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <ModalDelete        
       modalFielVisible={modalFielVisible}
       deleteModule={deleteModule}
       toggleModalFiel={toggleModalFiel}
        />      
    </>
  );
}
