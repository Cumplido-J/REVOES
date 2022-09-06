import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input, Card, Table  } from "antd";
import { CheckCircleOutlined, EditOutlined,EyeOutlined,DeleteOutlined } from "@ant-design/icons";




import Alerts from "../../shared/alerts";
import { ButtonIcon,PrimaryButton } from "../../shared/components";
import CatalogService from "../../service/CatalogService";
import Columns, { columnProps } from "../../shared/columns";
import UserService from "../../service/UserService";
import ModalEditGorupAndPermission from "./ModalEditGorupAndPermission";
import ModalDeleteGroupAndPermission from "./ModalDeleteGroupAndPermission";
import ToAssignGroupAndPermission from "./ToAssignGroupAndPermission";

const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
  };
  const rowProps = {
    style: { marginBottom: "1em" },
  };

  const validations = {
    name: [{ required: true, message: "¡El nombre del grupo es requerido! " }],
  };

  const Groups = () => {
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
            

              <ButtonIcon
                tooltip="Asignacion de permisos"
                icon={<EyeOutlined />}
                color="blue"  
                onClick={() =>selectModalToAssign(row.id,"Asignar",row.description1)}
              />
  
          </>
        );
      },
    },
    Columns.descriptionGrup1,
    Columns.descriptionGrup2,
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
  const [dataSet, setDataSet] = useState();
  const [GroupData, setGroupData] = useState();
  const [form] = Form.useForm();
  const [id, setId] = useState(null);
  const [modalFielVisibleEdit, setModalFielVisibleEdit] = useState(false);
  const [modalFielVisibleDelete, setModalFielVisibleDelete] = useState(false);
  const [modalFielVisibleToAssign, setModalFielVisibleToAssign] = useState(false);
  const [nameGroup, setNameGroup] = useState();

  useEffect(() => {
    setLoading(true);
    getGroupData()
    setLoading(false);
  }, [setDataSet,GroupData]);

  const getGroupData = async () => {
    const { groups } = await CatalogService.getAllGroups();
    setDataSet(groups)
    form.setFieldsValue({GroupData})
  }

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  const handleFinish = async (values) => {
    setLoading(true);
    await addGroup(values);
    setGroupData(values)
    form.setFieldsValue({ name:null});
    setLoading(false);
  };

  const addGroup = async (form) => {
    const response = await UserService.addGroup(form);
    if (!response.success) return;
    Alerts.success("Grupo guardado", "Grupo insertado correctamente");
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


  const selectModalToAssign = (id,caso,description1) =>{
    (caso==="Asignar")&&toggleModalFielToAssign();
    setId(id);
    setNameGroup(description1)
  };

  const toggleModalFielToAssign = () => {
    setModalFielVisibleToAssign(!modalFielVisibleToAssign);
  };

  const updateGroup = async (form) => {
  const response = await UserService.updateGroup(form);
  if (!response.success) return;
  Alerts.success("Grupo actualizado", "Grupo actualizado correctamente");
  setGroupData(form);
  };

  const deleteGroup = async (form) => {
    const response = await UserService.deleteGroup(form);
    if (!response.success) return;
    Alerts.success("Grupo eliminado", "Grupo eliminado correctamente");
    setGroupData(form);
  };

  const getGroupDataById = async (id) => {
    const { groupData } = await UserService.getGroupData(id);
    return groupData;
  }

    return (
      <>
        <Card title="Crear grupo"  style={{ width: 800 }}>
            <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
            
                <Row {...rowProps}>
                <Col {...colProps}>
                    <Form.Item label="Nombre del grupo:" name="name" rules={validations.name}>
                    <Input placeholder="Nombre del grupo" style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
                </Row>
                <Row {...rowProps}>
                <Col {...colProps}>
                  
                  <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
                    Guardar grupo
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
        dataSource={dataSet}
        size="small"
      />


      <ModalEditGorupAndPermission id = { id } nameIsForm = "Grupo" setId={ setId }
       toggleModalFielEdit={toggleModalFielEdit} modalFielVisibleEdit={modalFielVisibleEdit}
       onSubmit={updateGroup} getById={getGroupDataById}
       />
       <ModalDeleteGroupAndPermission id = { id } nameIsForm = "Grupo" setId={ setId }
       toggleModalFielDelete={toggleModalFielDelete} modalFielVisibleDelete={modalFielVisibleDelete}
       onSubmit={deleteGroup} getById={getGroupDataById}
       />
       <ToAssignGroupAndPermission id = { id } setId={ setId }
       toggleModalFielToAssign={toggleModalFielToAssign} modalFielVisibleToAssign={modalFielVisibleToAssign}
        nameRol={nameGroup}
       />
    </>
    )
}

export default Groups
