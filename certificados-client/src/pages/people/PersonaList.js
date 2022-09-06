import React, {useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { HomeOutlined,PlusCircleOutlined,ExclamationCircleOutlined} from "@ant-design/icons";
import { Row, Col, Breadcrumb,Card,Modal,message} from "antd";

import {Loading, Title,ButtonCustom} from "../../shared/components";
import PersonaService from "../../service/PersonaService";
import PersonaTable from "./PersonaTable";
import PersonaModal from "./PersonaModal";

import alerts from "../../shared/alerts";

export default function PersonaList(props) { 
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
 const [personaData, setPersonaData] = useState({});

  const showModal= () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk=()=>{
    setIsModalVisible(false);
  }

  const [personaList, setPersonaList] = useState([]);
  useEffect(() => {
    const personaSearch = async () => {
      setLoading(true);
      const response = await PersonaService.personaAll();
      setLoading(false);
      if (!response.success) return;
      setPersonaList(response.personaList);
    };
    personaSearch();
  }, []);  

  const addPersona = async (form) => { 
    const response = await PersonaService.addPersona(form);
    await reload();
    if (!response.success) return;
    alerts.success("Datos guardado", "insertado correctamente");
    //props.history.push(`/Planteles/Editar/${response.schoolData.cct}`);
  }; 
  const reload = async () => {
    setLoading(true);
    const response = await PersonaService.personaAll();
    setLoading(false);
    if (!response.success) return;
    setPersonaList(response.personaList);
  }
const modalDelete = async (curp) => {
  const confirmD = async () => {
    setLoading(true);
    const response = await PersonaService.deleteCurp(curp);
    setLoading(false);
    if (!response.success) return;
    message.success(response.message);
    await reload();
  };
  Modal.confirm({
    title: "¿Estás seguro de eliminar?",
    icon: <ExclamationCircleOutlined />,
    content: "El registro se eliminara de forma permanente.",
    onOk: confirmD,
    onCancel: () => setLoading(false),
    centered: true,
    zIndex: 1040,
  });
}; 
  return (
  <div>
    <BreadcrumbHeader/>
    <Card type="inner" title="" extra={<ButtonCustom icon={<PlusCircleOutlined />} loading={loading} size="large" fullWidth={false} onClick={showModal}>
              Agregar
            </ButtonCustom>}>
      <Loading loading={loading}>
        <PersonaTable  dataset={personaList} modalDelete={modalDelete} reload={reload}/>
      </Loading>
    </Card>
    <Modal width={1000} title="Agregar Firmante" 
                visible={isModalVisible} footer={null} onCancel={handleCancel}>
    <PersonaModal {...props} onSubmit={addPersona} />
    </Modal>
    
  </div>
  );
}

function BreadcrumbHeader(){
  return(
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Lista de Firmantes</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Lista de Firmantes</Title> 
        </Col>
      </Row>
    </>    
  );
}
