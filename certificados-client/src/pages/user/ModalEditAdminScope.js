import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input,Modal } from "antd";
import Alerts from "../../shared/alerts";
import {  Loading, PrimaryButton } from "../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";


const validations = {
  name: [{ required: true, message: "¡El nombre del grupo es requerido! " }],
};

const ModalEditAdminScope = ({modalFielVisibleEdit, toggleModalFielEdit,id = null, nameIsForm, onSubmit,setId,getById}) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const getData = async () => {
          setLoading(true);
          const  groupData  = await getById(id);
          form.setFieldsValue(groupData);
          setLoading(false);
        };
        if (id === null) {
            form.setFieldsValue({id: null,name: null,created:null});
        } else {
          getData();
        }
    }, [id]);
    

    const cerrar =() =>{
        setId(null);
        toggleModalFielEdit()
    }

    const handleFinishFailed = () => {
        Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };
    
    const handleFinish = async (values) => {
        setLoading(true);
        await onSubmit(values);
        form.setFieldsValue({id: null,name: null,created:null});
        setLoading(false);
        cerrar()
    };
    return (
        <>
        <Modal
            onCancel={cerrar}
            visible={modalFielVisibleEdit}
            width="60%"
            zIndex={1040}
            centered
            title={`Editar ${nameIsForm} ${id}` }
            footer={null}
        >
            <Loading loading={loading}>
                <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
                    <Row >
                        <Form.Item name="id" >
                            <Input type="hidden" style={{ width: "90%" }} />
                        </Form.Item>                      
                        <Col span={12}>
                            <Form.Item label="Nombre del catalogo del alcance:" name="description2" rules={validations.name}>
                            <Input placeholder="Nombre del catalogo del alcance" style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Descripción:" name="description3" >
                            <Input placeholder="Descripción" style={{ width: "90%" }} />
                            </Form.Item>
                        </Col> 
                    </Row >
                
                    <Row align="center">   
                        <Col span={12}>           
                                <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
                                    Actualizar {nameIsForm}
                                </PrimaryButton>     
                        </Col>
                    </Row>
                </Form>
            </Loading>
        </Modal>
        </>
    )
}

export default ModalEditAdminScope
