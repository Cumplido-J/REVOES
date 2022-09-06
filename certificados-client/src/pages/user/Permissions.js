import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input, Card, Table  } from "antd";
import { CheckCircleOutlined,EditOutlined,DeleteOutlined } from "@ant-design/icons";


import { PrimaryButton } from "../../shared/components";

import Alerts from "../../shared/alerts";
import { ButtonIcon } from "../../shared/components";
import CatalogService from "../../service/CatalogService";
import UserService from "../../service/UserService";
import Columns, { columnProps } from "../../shared/columns";
import ModalEditGorupAndPermission from "./ModalEditGorupAndPermission";
import ModalDeleteGroupAndPermission from "./ModalDeleteGroupAndPermission";

const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
  };
  const rowProps = {
    style: { marginBottom: "1em" },
  };

  const validations = {
    name: [{ required: true, message: "¡El nombre del grupo es requerido! " }],
    name: [{ required: true, message: "¡La descripción es requerido! " }],
  };

  const Permissions = () => {

  const columns  = () => [
    {
      ...columnProps,
      title: "Opciones",
      render: (row) => {
        return (
          <>
              <ButtonIcon
                tooltip="Editar"
                icon={<EditOutlined />}
                color="green"
                onClick={() =>selectModalUpdate(row.id,"Editar")}
              />
          </>
        );
      },
    },
    Columns.descriptionGrup1,
    Columns.descriptionGrup3,
    {
      ...columnProps,
      title: "Eliminar",
      render: (row) => {
        return (
          <>
              <ButtonIcon
                onClick={() =>selectModalDelete(row.id,"Eliminar")}
                tooltip="Eliminar"
                icon={<DeleteOutlined />}
                color="red"  
              />
  
          </>
        );
      },
    },
    
  ]; 
  

    const [loading, setLoading] = useState(false);
    const [dataset, setDataset] = useState();
    const [Count, setCount] = useState(0);
    const [PermissionData, setPermissionData] = useState();
    const [form] = Form.useForm();
    const [id, setId] = useState(null);
    const [modalFielVisibleEdit, setModalFielVisibleEdit] = useState(false);
    const [modalFielVisibleDelete, setModalFielVisibleDelete] = useState(false);

    useEffect(() => {
        getPermissionData()
    
    }, [setDataset,PermissionData])

    const getPermissionData = async () => {
      const {permissions} = await CatalogService.getAllPermissions();
      setDataset(permissions)
      setCount(permissions.length);
    }

    const handleFinishFailed = () => {
      Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };
  
    const handleFinish = async (values) => {
      setLoading(true);
      await addPermission(values);
      setPermissionData(values)
      form.setFieldsValue({ name:null});
      setLoading(false);
    };

    const addPermission = async (form) => {
      const response = await UserService.addPermission(form);
      if (!response.success) return;
      Alerts.success("Permiso guardado", "Permiso insertado correctamente");
    };


    const selectModalUpdate = (id,caso) =>{
      (caso==="Editar")&&toggleModalFielEdit();
      setId(id);
    }
    const toggleModalFielEdit = () => {
      setModalFielVisibleEdit(!modalFielVisibleEdit);
    };
    
    const selectModalDelete = (id,caso) =>{
      (caso==="Eliminar")&&toggleModalFielDelete();
      setId(id);
    };
  
    const toggleModalFielDelete = () => {
      setModalFielVisibleDelete(!modalFielVisibleDelete);
    };
  
    const updatePermission = async (form) => {
    const response = await UserService.updatePermission(form);
    if (!response.success) return;
    Alerts.success("Grupo actualizado", "Grupo actualizado correctamente");
    setPermissionData(form);
    };
  
    const deletePermission = async (form) => {
      const response = await UserService.deletePermission(form);
      if (!response.success) return;
      Alerts.success("Grupo eliminado", "Grupo eliminado correctamente");
      setPermissionData(form);
    };

    const getPermissionDataById = async (id) => {
      const { permissionData } = await UserService.getPermissionData(id);
      return permissionData;
    }

    return (
        <>
             <Card title="Crear permiso"  style={{ width: 800 }}>
                <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
                
                    <Row {...rowProps}>
                    <Col {...colProps}>
                        <Form.Item label="Nombre del permiso:" name="name" rules={validations.name}>
                        <Input placeholder="Nombre del permiso" style={{ width: "90%" }} />
                        </Form.Item>
                    </Col>
                    <Col {...colProps}>
                        <Form.Item label="Descripción:" name="description" rules={validations.name}>
                        <Input placeholder="Descripción" style={{ width: "90%" }} />
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row {...rowProps}>
                    <Col {...colProps}>
                    
                    <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
                        Guardar permiso
                    </PrimaryButton>
                    </Col>
                    </Row>

                </Form>
            </Card>
            <Table
                rowKey="id"
                bordered
                pagination={{ position: ["topLeft", "bottomLeft"] }}
                columns={columns()}
                scroll={{ x: columns.length * 200 }}
                dataSource={dataset}
                size="small"
            />
            <p>
            <strong>Registros encontrados: </strong> {Count}
            </p>

          <ModalEditGorupAndPermission id = { id } nameIsForm = "Permiso" setId={ setId }
          toggleModalFielEdit={toggleModalFielEdit} modalFielVisibleEdit={modalFielVisibleEdit}
          onSubmit={updatePermission} getById={getPermissionDataById} permission={true}
          />
          <ModalDeleteGroupAndPermission id = { id } nameIsForm = "Permiso" setId={ setId }
          toggleModalFielDelete={toggleModalFielDelete} modalFielVisibleDelete={modalFielVisibleDelete}
          onSubmit={deletePermission} getById={getPermissionDataById}
          />
        </>
    )
}

export default Permissions
