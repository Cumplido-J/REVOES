import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { HomeOutlined,SearchOutlined,PlusOutlined } from "@ant-design/icons";
import { Row, Col, Breadcrumb ,Form,Input,Modal} from "antd";
import Alerts from "../../shared/alerts";
import { Title,Loading, PrimaryButton,ButtonCustom}  from "../../shared/components";
import CompetenceService from "../../service/CompetenceService";
import CompetenciaForm from "./CompetenciaForm";

//import CareerFilter from "./CareerFilter";
import ModuleTable from "./ModuleTable";

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
export default function CompetenceIndex(props) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchModule = async function (values) {
    const response = await CompetenceService.competenceSearch(values);
    setLista(response.lista);
  };
  //Cargar toda la lista
  useEffect(() => {
    const competenceLoad = async () => {
      setLoading(true);
      const response = await CompetenceService.competenceAll();
      setLoading(false);
      if (!response.success) return;
      setLista(response.lista);
    };
    competenceLoad();
  }, []); 

  const addCompetencia = async (form) => {
    const response = await CompetenceService.addCompetencia(form);
    if (!response.success) return;
    await reload();
    Alerts.success("Competencia guardado", "Competencia insertado correctamente");
  };  
  //recarga la lista
  const reload= async () => {
    const response2 = await CompetenceService.competenceAll();
    setLista(response2.lista);
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
          <span>Lista de competencias</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Lista de competencias</Title>
        </Col>
      </Row>
      <Filter {...props} onSubmit={searchModule } addCompetencia={addCompetencia}/>
      <ModuleTable  {...props} dataset={lista} reload={reload}/>
    </>
  );
}

function Filter({onSubmit,addCompetencia}){
  const [formSearch] = Form.useForm();
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
      <Form form={formSearch} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Nombre de la competencia:" name="searchText" rules={validations.searchText}>
              <Input placeholder="Nombre de la competencia" style={{ width: "90%" }} />
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
          <ButtonCustom
            tooltip="Agregar"
            color="gold"
            fullWidth
            onClick={toggleModalFiel}
            loading={loading}
            icon={<PlusOutlined />}            
            >
            Agregar 
          </ButtonCustom>            
            </Col>  
        </Row>
      </Form>
      <ShowModalAgregar  modalFielVisible={modalFielVisible} 
      toggleModalFiel={toggleModalFiel}  addCompetencia={addCompetencia}  setModalFielVisible={ setModalFielVisible}/>
    </Loading>
  );
}
function ShowModalAgregar({ modalFielVisible, setModalFielVisible,props,addCompetencia}){
  //const [lista, setLista] = useState([]);
  const [competenceData, setCompetenceData] = useState({});
  return (
<Modal zIndex="1040" 
      centered 
      width={800} 
      title="Agregar Competencia" 
      visible={modalFielVisible} 
      footer={null} 
      onCancel={() => {
        setModalFielVisible(false);
        setCompetenceData({module:null,emsadCompetence:null})
      }}> 
  <CompetenciaForm {...props} competenceData={competenceData} onSubmit={addCompetencia} />
</Modal>

  );
}