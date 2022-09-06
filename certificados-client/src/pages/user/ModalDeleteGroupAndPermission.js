import React, { useEffect, useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Form, Row, Col, Input,Modal } from "antd";
import { Loading } from "../../shared/components";

import { PrimaryButton ,ButtonCustom} from "../../shared/components";


const ModalDeleteGroupAndPermission = ({modalFielVisibleDelete, toggleModalFielDelete, id = null, nameIsForm, onSubmit,setId,getById}) => {
    const [loading, setLoading] = useState(false);
    const [Data,setData]= useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
      const getData = async () => {
        setLoading(true);
        const  groupData  = await getById(id);
        setData(groupData);
        form.setFieldsValue(groupData);
        setLoading(false);
      };
      if (id === null) {
        setData([]);
      } else {
        getData();
        //searchCareerData(cct);
      }
    }, [id]);


  const cerrar =() =>{
      setId(null);
      toggleModalFielDelete()
  }

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
                    visible={modalFielVisibleDelete}
                    width="40%"
                    zIndex={1040}
                    centered
                    title={`Eliminar ${nameIsForm} ${id}` }
                    footer={null}
                >
                <Loading loading={loading}>
                    
                    <Form form={form} onFinish={handleFinish}  layout="vertical">
                    <Row  align="center">
                      <p>
                      Deseas eliminar el grupo:<strong style={{color: "red" }}> {Data.name} </strong>
                      </p>
                    </Row>  
                        <Row  align="center">
                            <Form.Item name="id" >
                                <Input type="hidden" style={{ width: "90%" }} />
                            </Form.Item>     
  
                            <Col span={10}>           
                                    <PrimaryButton icon={<CheckCircleOutlined />} loading={loading}  fullWidth={false}>
                                        Eliminar {nameIsForm}
                                    </PrimaryButton>     
                            </Col>
                            <Col > 
                            <ButtonCustom
                                color="blue"
                                fullWidth
                                icon={<CheckCircleOutlined />}
                                onClick={cerrar}
                            >
                            Cancelar
                            </ButtonCustom>
                            </Col > 
                        </Row>
                    </Form>
                    
                </Loading>
                </Modal>  
        </>
    )
}

export default ModalDeleteGroupAndPermission
