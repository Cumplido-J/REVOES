import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { HomeOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Row, Col, Breadcrumb, Form, Input, Modal } from "antd";
import Alerts from "../../shared/alerts";
import { Title, Loading, PrimaryButton, ButtonCustom } from "../../shared/components";
import CareerService from "../../service/CareerService";
import CareerTable from "./CareerTable";
import CareerForm from "./CareerForm";
//import SchoolSearchActions from "./SchoolSearchActions";
import { userHasRole } from "../../shared/functions";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  searchText: [{ required: true, message: "¡Ingrese una palabra a buscar!" }]
};
export default function CareerSearch(props) {
  const [careerList, setCareerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = props;

  const searchCareer = async function (values) {
    const response = await CareerService.careerSearch(values);
    setCareerList(response.careerList);
  };
  //Cargar toda la lista
  useEffect(() => {
    const careerLoad = async () => {
      setLoading(true);
      const response = await CareerService.careerAll();
      setLoading(false);
      if (!response.success) return;
      setCareerList(response.careerList);
    };
    careerLoad();
  }, []);


  const addCareer = async (form) => {
    const response = await CareerService.addCareer(form);
    if (!response.success) return;
    await reload();
    Alerts.success("Carrera guardado", "Carrera insertado correctamente");
    //props.history.push(`/Carreras/Editar/${response.careerData.cct}`);
  };
  const reload = async () => {
    const response2 = await CareerService.careerAll();
    setCareerList(response2.careerList);
  };
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Lista de carreras</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Lista de carreras</Title>
        </Col>
      </Row>
      <Botones {...props} onSubmit={searchCareer} addCareer={addCareer} userProfile={userProfile} />
      <CareerTable  {...props} dataset={careerList} reload={reload} userProfile={userProfile} />
    </>
  );
}


function Botones({ onSubmit, addCareer, userProfile }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalFielVisible, setModalFielVisible] = useState(false);
  const toggleModalFiel = () => {
    setModalFielVisible(!modalFielVisible);
  };

  const handleFinish = async (values) => {
    setLoading(true);
    await onSubmit(values);
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };
  return (
    <Loading loading={loading}>
      <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Nombre/Clave carrera:" name="searchText">
              <Input placeholder="Nombre/Clave carrera" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <PrimaryButton loading={loading} icon={<SearchOutlined />}>
              Buscar
            </PrimaryButton>
          </Col>
          <Col {...colProps}></Col>
          <Col {...colProps}>
            {(userHasRole.dev(userProfile.roles)) && (
              <ButtonCustom
                tooltip="Agregar"
                color="gold"
                fullWidth
                onClick={toggleModalFiel}
                loading={loading}
                icon={<PlusOutlined />}>
                Agregar
              </ButtonCustom>
            )}
          </Col>
        </Row>
      </Form>
      <ShowModalAgregar modalFielVisible={modalFielVisible}
        toggleModalFiel={toggleModalFiel} addCareer={addCareer} setModalFielVisible={setModalFielVisible} userProfile={userProfile} />
    </Loading>
  );
}
function ShowModalAgregar({ modalFielVisible, toggleModalFiel, props, addCareer, setModalFielVisible, userProfile }) {
  const [careerData, setCareerData] = useState({});
  return (
    <Modal
      zIndex="1040"
      centered width={800}
      title="Agregar Carrera"
      visible={modalFielVisible}
      footer={null}
      onCancel={() => {
        setModalFielVisible(false);
        setCareerData({
          name: null, careerKey: null,
          totalCredits: null,
          profileType: 0,
          studyType: 0,
          disciplinaryField: 0,
          subjectType: 0,
          statusId: 0
        })
      }}>
      <CareerForm {...props} careerData={careerData} onSubmit={addCareer} userProfile={userProfile}  />
    </Modal>
  );
}