import React, { useEffect, useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Form, Row, Col, Input,Modal } from "antd";
import { Loading } from "../../shared/components";

import { PrimaryButton ,ButtonCustom} from "../../shared/components";

const ModalDeleteAdminScope = ({modalFielVisibleDelete, toggleModalFielDelete, id = null, nameIsForm, onSubmit,setId,getById, dataScope = []}) => {

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
      }
    }, [id]);


  const cerrar =() =>{
      setId(null);
      toggleModalFielDelete()
  }

  const handleFinish = async (values) => {
    setLoading(true);
    await onSubmit(values);
    form.setFieldsValue({id: null,description2: null,description3:null});
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
                    {!dataScope &&(
                      <p>
                      Deseas eliminar el grupo:<strong style={{color: "red" }}> {Data.description2} </strong>
                      </p>
                    )}
                    {dataScope &&(
                      <p>
                      Deseas eliminar el estado:<strong style={{color: "red" }}> {dataScope.description2} </strong>
                      {dataScope.description3 &&(
                       <p>asociado al plantel <strong style={{color: "red" }}> {dataScope.description3}  </strong></p>
                      )}
                      </p>
                    )}  
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

export default ModalDeleteAdminScope
