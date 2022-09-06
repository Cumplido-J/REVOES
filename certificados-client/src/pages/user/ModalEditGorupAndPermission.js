import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input,Modal } from "antd";
import Alerts from "../../shared/alerts";
import {  Loading, PrimaryButton } from "../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";


const validations = {
  name: [{ required: true, message: "¡El nombre del grupo es requerido! " }],
};

const ModalEditGorupAndPermission = ({modalFielVisibleEdit, toggleModalFielEdit,id = null, nameIsForm, onSubmit,setId,getById,permission=false}) => {
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
        //setGroupData(values)
        form.setFieldsValue({id: null,name: null,created:null});
        setLoading(false);
        cerrar()
      };


    return (
        <>
                <Modal
                    onCancel={cerrar}
                    visible={modalFielVisibleEdit}
                    width="40%"
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
                            <Form.Item name="created" >
                                <Input type="hidden" style={{ width: "90%" }} />
                            </Form.Item>                       
                            <Col span={24}> 

                                    <Form.Item label="Nombre del grupo:" name="name" rules={validations.name}>
                                    <Input placeholder="Nombre del grupo" style={{ width: "100%" }} />
                                    </Form.Item>
                            </Col > 
                        </Row >
                        <Row>
                            {permission &&(
                            <Col span={24}> 
                                <Form.Item label="Descripción:" name="description" rules={validations.name}>
                                <Input placeholder="Descripción" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col > 
                            )}
                        </Row>
                    
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

export default ModalEditGorupAndPermission
