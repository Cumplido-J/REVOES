import React, { useEffect, useState } from "react";

import { Form, Row, Col, Descriptions, Select } from "antd";
import { SearchOutlined, SaveOutlined } from "@ant-design/icons";

import { Loading, PrimaryButton, SearchSelect, ButtonCustom } from "../../../shared/components";
import Alerts from "../../../shared/alerts";

import CatalogService from "../../../service/CatalogService";
import ReportsSchoolEnrollmentService from "../../../service/ReportsSchoolEnrollmentService";

const { Option } = Select;

const colProps = {
  xs: { span: 24 },
  md: { span: 6 },
};

const colProps2 = {
  xs: { span: 12 },
  md: { span: 4 },
};

const rowProps = {
  style: { marginBottom: "1em" },
};

export default function GraduateCaptureSearch({ onSubmit }) {
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({ states: [], schools: [], careers: [] , schoolCycles: []});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function getStates() {
      const response = await CatalogService.getStateCatalogs();
      if (!response) return;
      const states = response.states.map((state) => ({ id: state.id, description: state.description1 }));

      setCatalogs({ states, schools: [], careers: [], schoolCycles:[] });
      setLoading(false);
    }
    getStates();
  }, []);

//para guardar de los los intputs de valores
const [formrows, setFormrows]=useState({encontro:false,
                                        id:0,
                                        hombres_eg:0,mujeres_eg:0,
                                        hombres_tit:0,mujeres_tit:0
                                        });

//para guardar los estados del select de matricula y los intputs de valores (si estan deshabilitados o no)
const [noSelect, setNoSelect]=useState({
  selPlan:true,
  selCarr:true,
  selCiclo:true,
  selMatr:true,
  btnBus:true,
  insCaptura:true,
  btnActGu:true
});

///////------------------------------CARGA LOS SELECTS-----------------------------------------------
////////////////////////OnCHANGE SELECT de Estado
  const onChangeState = async (stateId) => {
    //ejecuta el servicio para obtener las escuelas
    const response = await CatalogService.getSchoolCatalogs(stateId);
    if (!response) return;
    const schools = response.schools.map((school) => ({
      id: school.id,
      description: `${school.description1} - ${school.description2}`,
    }));
    //resetea los valores de los selects
    form.setFieldsValue({ schoolId: null, careerId: null, cicloId: null, enrollId: null });
    //setea el select de plantel y deja vacios los demas
    setCatalogs({ ...catalogs, schools, careers: [], schoolCycles:[] });
    //habilitamos el select plantel, deshabilitamos lo demas
    setNoSelect({...noSelect,selPlan:false, 
                            selCarr:true, 
                            selCiclo:true,
                            selMatr:true,
                            btnBus:true,
                            insCaptura:true,
                            btnActGu:true});
    //reseteamos los inputs a 0
    setFormrows(
      {encontro:false,
        id:0,
        hombres_eg:0,mujeres_eg:0,
        hombres_tit:0,mujeres_tit:0
        });
  };
////////////////////////OnCHANGE SELECT de Plantel
  const onChangeSchool = async (schoolId) => {
    //ejecuta servicio para obtener las carreras
    const response = await CatalogService.getCareerCatalogs(schoolId);
    if (!response) return;
    const careers = response.careers.map((career) => ({
      id: career.id,
      description: `${career.description1} - ${career.description2}`,
    }));
    //resetea los selects de los valores
    form.setFieldsValue({ careerId: null, cicloId: null, enrollId: null });
    //setea el select de carrera y deja vacios los demas
    setCatalogs({ ...catalogs, careers, schoolCycles:[] });
    //habilitamos el select carrera, deshabilitamos lo demas
    setNoSelect({...noSelect, selCarr:false, 
      selCiclo:true,
      selMatr:true,
      btnBus:true,
      insCaptura:true,
      btnActGu:true});
    //reseteamos los inputs a 0
    setFormrows(
    {encontro:false,
    id:0,
    hombres_eg:0,mujeres_eg:0,
    hombres_tit:0,mujeres_tit:0
    });
  };
////////////////////////OnCHANGE SELECT carrera
  const onChangeCarrer = async () => {
    //invocamos servicio de ciclos
    const response = await ReportsSchoolEnrollmentService.getSchoolCycles();
    if (!response) return;
    const schoolCycles = response.reports.map((cycle) => (
      { id: cycle.id, description: cycle.name }));
    
    //seteamos el id seleccionado null
    form.setFieldsValue({ cicloId: null, enrollId: null });
    //catgamos los ciclos
    setCatalogs({ ...catalogs, schoolCycles });
    //habilitamos el select ciclo y deshabilitamos lo demas
    setNoSelect({...noSelect,selCiclo:false,      
      selMatr:true,
      btnBus:true,
      insCaptura:true,
      btnActGu:true});
    //reseteamos los inputs a 0
    setFormrows(
      {encontro:false,
        id:0,
        hombres_eg:0,mujeres_eg:0,
        hombres_tit:0,mujeres_tit:0
        });
  };
////////////////////////OnCHANGE SELECT ciclo
const onChangeCycle = () => {
  //reseteamos el valor del siguiente select a null
  form.setFieldsValue({ enrollId: null});
  //habilitamos el select matricula
  setNoSelect({...noSelect,selMatr:false,
    btnBus:true,
    insCaptura:true,
    btnActGu:true});
  //reseteamos los inputs a 0
  setFormrows(
    {encontro:false,
      id:0,
      hombres_eg:0,mujeres_eg:0,
      hombres_tit:0,mujeres_tit:0
      });
  };
////////////////////////OnCHANGE SELECT MAtricula
  const onChangeEnrollment=event=> {
    //habilitamos el boton buscar y deshabilitamos lo demas
    setNoSelect({...noSelect,btnBus:false,
      insCaptura:true,
      btnActGu:true});
    //seteamos el label de semestre y habilitamos boton buscar
    if(event==1)
    {
      //seteamos el label de semestre
      setFormrows({
        ...formrows,
        encontro:false,
        id:0,
        hombres_eg:0,mujeres_eg:0,
        hombres_tit:0,mujeres_tit:0
      });
    }else if(event==2)
    {
      //seteamos el label de semestre
      setFormrows({
        ...formrows,
        encontro:false,
        id:0,
        hombres_eg:0,mujeres_eg:0,
        hombres_tit:0,mujeres_tit:0
      });
    }else
    {
      //seteamos todo en blanco
      setFormrows({
        ...formrows,
        encontro:false,
        id:0,
        hombres_eg:0,mujeres_eg:0,
        hombres_tit:0,mujeres_tit:0
      });
      //deshabilitamos buscar lo demas
      setNoSelect({...noSelect,btnBus:true,
        insCaptura:true,
        btnActGu:true});
    }
  };

////////////////////////OnCLICK btnBuscar
const onClickBuscar = async () => {
  let stateId=form.getFieldsValue().stateId;
  let schoolId=form.getFieldsValue().schoolId;
  let careerId=form.getFieldsValue().careerId;
  let cicloId=form.getFieldsValue().cicloId;
  let enrollId=form.getFieldsValue().enrollId;

  //variables para almacenar los valores del get
  let hombres_eg=0; 
  let mujeres_eg=0; 
  let hombres_tit=0; 
  let mujeres_tit=0; 
  let id=0;

  
  //guardamos si encontro datos
  let encontro=false;
  const response = await ReportsSchoolEnrollmentService.getGraduates(stateId,schoolId,careerId,cicloId,enrollId);
  if (!response) return;
  //deshabilitamos habilitamos todo
  setNoSelect({...noSelect,
    insCaptura:false,
    btnActGu:false});
    console.log(response.reports);
//iteramos en la respuesta
  for (let i = 0; i < response.reports.length; i++) {
    encontro=true;
    id=response.reports[i].reportsId;
    hombres_eg=response.reports[i].egr_h;
    mujeres_eg=response.reports[i].egr_m;
    hombres_tit=response.reports[i].tit_h;
    mujeres_tit=response.reports[i].tit_m;
  }
  //validamos si encontro algo
  if(encontro)
  {
    Alerts.success("Éxito", "Se encontraron datos");
    setFormrows({
      ...formrows,
      encontro:encontro,
      id:id,
      hombres_eg:hombres_eg,mujeres_eg:mujeres_eg,
      hombres_tit:hombres_tit,mujeres_tit:mujeres_tit
    });
  }else{
    Alerts.warning("Éxito", "No se encontraron datos");
  }
  console.log(formrows);
};
////////////////////////OnCLICK ActInsertar
const onClickActInsertar = async (event) => {
  event.preventDefault();
 
  let schoolId=form.getFieldsValue().schoolId;
  let careerId=form.getFieldsValue().careerId;
  let cicloId=form.getFieldsValue().cicloId;
  let enrollId=form.getFieldsValue().enrollId;

  //variables para almacenar los valores del get
  let hombres_eg=formrows.hombres_eg; 
  let mujeres_eg=formrows.mujeres_eg; 
  let hombres_tit=formrows.hombres_tit; 
  let mujeres_tit=formrows.mujeres_tit; 
  //almacenamos la peticion
  let peticion=[];

  //validamos si es update o insert
  if(formrows.encontro)
  {
    //update
    let id=formrows.id;


    peticion=[
      {reportsId: id, matricula:enrollId, egr_h: parseInt(hombres_eg) ,egr_m: parseInt(mujeres_eg), tit_h: parseInt(hombres_tit) ,tit_m: parseInt(mujeres_tit),plantelId: schoolId, cicloId: cicloId, carreraId: careerId}
    ];
    //mandamos la peticion update
    const response = await ReportsSchoolEnrollmentService.updateGraduates(peticion);
    if (!response.success)
    {
      Alerts.error("Error", "Datos de Egresados/titulados NO actualizados");
      return;
    }else{
      Alerts.success("Éxito", "Datos de Egresados/titulados actualizados");
    } 
  }else{
    //insert
    peticion=[
      {reportsId: null, matricula:enrollId, egr_h: parseInt(hombres_eg) ,egr_m: parseInt(mujeres_eg), tit_h: parseInt(hombres_tit) ,tit_m: parseInt(mujeres_tit),plantelId: schoolId, cicloId: cicloId, carreraId: careerId}
    ];
    //mandamos la peticion inser
    const response = await ReportsSchoolEnrollmentService.insertGraduates(peticion);
    if (!response.success)
    {
      Alerts.error("Error", "Datos de Egresados/titulados NO guardados");
      return;
    }else{
      Alerts.success("Éxito", "Datos de Egresados/titulados guardados");
      //buscamos el valor por si se quiere hacer update despues de esto
      onClickBuscar();
    } 
  }
  //console.log(peticion);
  
};
///////////////////

////////// cualquier input de captura que cambie
  const handleReportsfill=event=>
  {
 
    setFormrows({
      ...formrows,
      [event.target.name]:event.target.value
    });
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
        <Row>
          <Col {...colProps}>
            <Form.Item label="Estado:" name="stateId">
              <SearchSelect dataset={catalogs.states} required onChange={onChangeState} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Plantel:" name="schoolId">
              <SearchSelect dataset={catalogs.schools} disabled={noSelect.selPlan} required onChange={onChangeSchool} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Carrera:" name="careerId">
              <SearchSelect dataset={catalogs.careers} disabled={noSelect.selCarr} required onChange={onChangeCarrer}/>
            </Form.Item>
          </Col>
        </Row>


        <Row>
        <Col {...colProps}>
            <Form.Item label="Ciclo:" name="cicloId">
              <SearchSelect disabled={noSelect.selCiclo} required dataset={catalogs.schoolCycles}  onChange={onChangeCycle}/>
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Semestre:" name="enrollId" style={{ width: "90%" }} >
              <Select disabled={noSelect.selMatr} onChange={onChangeEnrollment}>
                <Option value="1">A</Option>
                <Option value="2">B</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <label>&nbsp;</label><br/>
            <ButtonCustom loading={loading} disabled={noSelect.btnBus} icon={<SearchOutlined />} onClick={onClickBuscar}>
              Buscar
            </ButtonCustom>
          </Col>
        </Row>

        <Row {...rowProps}><Col span="24" style={{ width: "90%" }}><hr/></Col></Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Descriptions title="Datos capturados:">
            </Descriptions>
          </Col>
        </Row>

        <hr/>
        <Row >
          <Col span="24" style={{ width: "100%" }}>
            <Row>
              <Col span="12">Titulados</Col> <Col span="12">Egresados</Col>
            </Row>
            <br/>
            <Row>
              <Col span="6">
                <label>Hombres:</label><br/>
                <input type="number" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="hombres_tit" value={formrows.hombres_tit} style={{ width: "60%" }} onChange={handleReportsfill}/>
                <br/>
              </Col>
              <Col span="6">
                <label>Mujeres:</label><br/>
                <input type="number" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="mujeres_tit" value={formrows.mujeres_tit} style={{ width: "60%" }} onChange={handleReportsfill}/>
                
              </Col>
              <Col span="6">
                <label>Hombres:</label><br/>
                <input type="number" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="hombres_eg" value={formrows.hombres_eg} style={{ width: "60%" }} onChange={handleReportsfill}/>
                <br/>
              </Col>
              <Col span="6">
                <label>Mujeres:</label><br/>
                <input type="number" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="mujeres_eg" value={formrows.mujeres_eg} style={{ width: "60%" }} onChange={handleReportsfill}/>
                <br/>      
              </Col>
            </Row>
            <br/>
          </Col>
        </Row>
        <br/>

        <hr/>
        <Row {...rowProps}>
          <Col {...colProps2}>
            <div style={{ width: "65%" }}><h5>Totales</h5></div> 
          </Col>
        </Row>
        
        <Row>
          <Col {...colProps2}>
            <div style={{ width: "60%" }}>Titulados: <br/>{parseInt(formrows.hombres_tit)+parseInt(formrows.mujeres_tit)}</div>
          </Col>
          <Col {...colProps2}>
            <div style={{ width: "60%" }}>Egresados: <br/>{parseInt(formrows.hombres_eg)+parseInt(formrows.mujeres_eg)}</div>
          </Col>
        </Row>
        <br/>

        <Row {...rowProps}>
          <Col {...colProps}>
            <PrimaryButton loading={loading} disabled={noSelect.btnActGu} icon={<SaveOutlined />} onClick={onClickActInsertar}>
              Actualizar/Guardar
            </PrimaryButton>
          </Col>
        </Row>


      </Form>
    </Loading>
  );
}