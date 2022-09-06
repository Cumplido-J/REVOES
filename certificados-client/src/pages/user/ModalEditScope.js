import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input,Modal } from "antd";
import Alerts from "../../shared/alerts";
import {  Loading, PrimaryButton,SearchSelect } from "../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";
import { studentStatusCatalog } from "../../shared/catalogs";
import UserService from "../../service/UserService";
import CatalogService from "../../service/CatalogService";

const validations = {
    name: [{ required: true, message: "¡El nombre del grupo es requerido! " }],
    stateId: [{ required: true, message: "¡El estado es requerido!" }],
    statusId: [{ required: true, message: "¡El estatus es requerido!" }],
  };

  async function getStates() {
    const response = await CatalogService.getStateCatalogs();
    return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}

async function getSchools(stateId) {
    const response = await CatalogService.getSchoolCatalogs(stateId);
    return response.schools.map((school) => ({
      id: school.id,
      description: `${school.description1} - ${school.description2}`,
    }));
}

const ModalEditScope = ({modalFielVisibleEdit, toggleModalFielEdit,id = null, nameIsForm, onSubmit,setId,getById}) => {
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([]);
    const [schools, setSchools] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const getData = async () => {
          setLoading(true);
          const states = await getStates();
          setStates(states);
          const  groupData  = await getById(id);
          const schools = await getSchools(groupData.stateId);
          
        
          setSchools(schools)
         
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
        setSchools([]);
        setStates([]);
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
    async function onChangeState(stateId) {
        const schools = await getSchools(stateId);
        form.setFieldsValue({ schoolId: null, careerId: null });
        setSchools(schools);
    }  
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
                    <Col span={8}>
                    <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
                        <SearchSelect dataset={states} onChange={onChangeState} />
                    </Form.Item>
                    </Col>
                    <Col span={8}>
                    <Form.Item label="Plantel:" name="schoolId" >
                        <SearchSelect dataset={schools} />
                    </Form.Item>
                    </Col>

                    <Col span={8}>
                    <Form.Item label="Estatus:" name="statusId" rules={validations.statusId}>
                    <SearchSelect dataset={studentStatusCatalog} />
                    </Form.Item>
                    </Col>    

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

export default ModalEditScope
