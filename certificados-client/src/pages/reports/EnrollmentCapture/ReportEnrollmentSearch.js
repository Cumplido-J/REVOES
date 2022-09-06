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

export default function ReportEnrollmentSearch({ onSubmit }) {
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
const [formrows, setFormrows]=useState({semestre0:0,semestre1:0,semestre2:0,encontro:false,
                                        id0:0,id1:0,id2:0,id3:0,id4:0,id5:0,
                                        grupos0m:0,hombres0m:0,mujeres0m:0,grupos0v:0,hombres0v:0,mujeres0v:0,
                                        grupos1m:0,hombres1m:0,mujeres1m:0,grupos1v:0,hombres1v:0,mujeres1v:0,
                                        grupos2m:0,hombres2m:0,mujeres2m:0,grupos2v:0,hombres2v:0,mujeres2v:0
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
      {semestre0:0,semestre1:0,semestre2:0,encontro:false,
        id0:0,id1:0,id2:0,id3:0,id4:0,id5:0,
        grupos0m:0,hombres0m:0,mujeres0m:0,grupos0v:0,hombres0v:0,mujeres0v:0,
        grupos1m:0,hombres1m:0,mujeres1m:0,grupos1v:0,hombres1v:0,mujeres1v:0,
        grupos2m:0,hombres2m:0,mujeres2m:0,grupos2v:0,hombres2v:0,mujeres2v:0
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
    {semestre0:0,semestre1:0,semestre2:0,encontro:false,
    id0:0,id1:0,id2:0,id3:0,id4:0,id5:0,
    grupos0m:0,hombres0m:0,mujeres0m:0,grupos0v:0,hombres0v:0,mujeres0v:0,
    grupos1m:0,hombres1m:0,mujeres1m:0,grupos1v:0,hombres1v:0,mujeres1v:0,
    grupos2m:0,hombres2m:0,mujeres2m:0,grupos2v:0,hombres2v:0,mujeres2v:0
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
      {semestre0:0,semestre1:0,semestre2:0,encontro:false,
        id0:0,id1:0,id2:0,id3:0,id4:0,id5:0,
        grupos0m:0,hombres0m:0,mujeres0m:0,grupos0v:0,hombres0v:0,mujeres0v:0,
        grupos1m:0,hombres1m:0,mujeres1m:0,grupos1v:0,hombres1v:0,mujeres1v:0,
        grupos2m:0,hombres2m:0,mujeres2m:0,grupos2v:0,hombres2v:0,mujeres2v:0
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
    {semestre0:0,semestre1:0,semestre2:0,encontro:false,
      id0:0,id1:0,id2:0,id3:0,id4:0,id5:0,
      grupos0m:0,hombres0m:0,mujeres0m:0,grupos0v:0,hombres0v:0,mujeres0v:0,
      grupos1m:0,hombres1m:0,mujeres1m:0,grupos1v:0,hombres1v:0,mujeres1v:0,
      grupos2m:0,hombres2m:0,mujeres2m:0,grupos2v:0,hombres2v:0,mujeres2v:0
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
        semestre0:1,semestre1:3,semestre2:5,encontro:false,
        id0:0,id1:0,id2:0,id3:0,id4:0,id5:0,
        grupos0m:0,hombres0m:0,mujeres0m:0,grupos0v:0,hombres0v:0,mujeres0v:0,
        grupos1m:0,hombres1m:0,mujeres1m:0,grupos1v:0,hombres1v:0,mujeres1v:0,
        grupos2m:0,hombres2m:0,mujeres2m:0,grupos2v:0,hombres2v:0,mujeres2v:0
      });
    }else if(event==2)
    {
      //seteamos el label de semestre
      setFormrows({
        ...formrows,
        semestre0:2,semestre1:4,semestre2:6,encontro:false,
        id0:0,id1:0,id2:0,id3:0,id4:0,id5:0,
        grupos0m:0,hombres0m:0,mujeres0m:0,grupos0v:0,hombres0v:0,mujeres0v:0,
        grupos1m:0,hombres1m:0,mujeres1m:0,grupos1v:0,hombres1v:0,mujeres1v:0,
        grupos2m:0,hombres2m:0,mujeres2m:0,grupos2v:0,hombres2v:0,mujeres2v:0
      });
    }else
    {
      //seteamos todo en blanco
      setFormrows({
        ...formrows,
        semestre0:0,semestre1:0,semestre2:0,encontro:false,
        id0:0,id1:0,id2:0,id3:0,id4:0,id5:0,
        grupos0m:0,hombres0m:0,mujeres0m:0,grupos0v:0,hombres0v:0,mujeres0v:0,
        grupos1m:0,hombres1m:0,mujeres1m:0,grupos1v:0,hombres1v:0,mujeres1v:0,
        grupos2m:0,hombres2m:0,mujeres2m:0,grupos2v:0,hombres2v:0,mujeres2v:0
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
  let grupos0m=0; 
  let hombres0m=0; 
  let mujeres0m=0; 
  let grupos0v=0; 
  let hombres0v=0; 
  let mujeres0v=0; 
  let grupos1m=0; 
  let hombres1m=0; 
  let mujeres1m=0; 
  let grupos1v=0; 
  let hombres1v=0; 
  let mujeres1v=0; 
  let grupos2m=0; 
  let hombres2m=0; 
  let mujeres2m=0; 
  let grupos2v=0; 
  let hombres2v=0; 
  let mujeres2v=0;
  let semestre0=0;
  let semestre1=0;
  let semestre2=0;
  let id0=0;
  let id1=0;
  let id2=0;
  let id3=0;
  let id4=0;
  let id5=0;
  
  //guardamos si encontro datos
  let encontro=false;
  const response = await ReportsSchoolEnrollmentService.getSchoolEnrollment(stateId,schoolId,careerId,cicloId,enrollId);
  if (!response) return;
  //deshabilitamos habilitamos todo
  setNoSelect({...noSelect,
    insCaptura:false,
    btnActGu:false});

    console.log(response.reports);

//iteramos en la respuesta
  for (let i = 0; i < response.reports.length; i++) {
    let semestre=""+response.reports[i].semestre;
    encontro=true;
    switch((semestre)) {
      case '1':
      {
        if(response.reports[i].turno==1){
          semestre0=1;
          id0=response.reports[i].reportsId;
          grupos0m=response.reports[i].num_grupos;
          hombres0m=response.reports[i].num_h;
          mujeres0m=response.reports[i].num_m;
        }else{
          semestre0=1;
          id1=response.reports[i].reportsId;
          grupos0v=response.reports[i].num_grupos;
          hombres0v=response.reports[i].num_h;
          mujeres0v=response.reports[i].num_m;
        }
        break;
      }
      case '2':
      {
        if(response.reports[i].turno==1){
          semestre0=2;
          id0=response.reports[i].reportsId;
          grupos0m=response.reports[i].num_grupos;
          hombres0m=response.reports[i].num_h;
          mujeres0m=response.reports[i].num_m;
        }else{
          semestre0=2;
          id1=response.reports[i].reportsId;
          grupos0v=response.reports[i].num_grupos;
          hombres0v=response.reports[i].num_h;
          mujeres0v=response.reports[i].num_m;
        }  
        break;      
      }
      case '3':
      {
        if(response.reports[i].turno==1){
          semestre1=3;
          id2=response.reports[i].reportsId;
          grupos1m=response.reports[i].num_grupos;
          hombres1m=response.reports[i].num_h;
          mujeres1m=response.reports[i].num_m;
        }else{
          semestre1=3;
          id3=response.reports[i].reportsId;
          grupos1v=response.reports[i].num_grupos;
          hombres1v=response.reports[i].num_h;
          mujeres1v=response.reports[i].num_m;
        }   
        break;     
      }
      case '4':
      {
        if(response.reports[i].turno==1){
          semestre1=4;
          id2=response.reports[i].reportsId;
          grupos1m=response.reports[i].num_grupos;
          hombres1m=response.reports[i].num_h;
          mujeres1m=response.reports[i].num_m;
        }else{
          semestre1=4;
          id3=response.reports[i].reportsId;
          grupos1v=response.reports[i].num_grupos;
          hombres1v=response.reports[i].num_h;
          mujeres1v=response.reports[i].num_m;
        }   
        break;       
      }
      case '5':
      {
        if(response.reports[i].turno==1){
          semestre2=5;
          id4=response.reports[i].reportsId;
          grupos2m=response.reports[i].num_grupos;
          hombres2m=response.reports[i].num_h;
          mujeres2m=response.reports[i].num_m;
        }else{
          semestre2=5;
          id5=response.reports[i].reportsId;
          grupos2v=response.reports[i].num_grupos;
          hombres2v=response.reports[i].num_h;
          mujeres2v=response.reports[i].num_m;
        }  
        break;       
      }
      case '6':
      {
        if(response.reports[i].turno==1){
          semestre2=6;
          id4=response.reports[i].reportsId;
          grupos2m=response.reports[i].num_grupos;
          hombres2m=response.reports[i].num_h;
          mujeres2m=response.reports[i].num_m;
        }else{
          semestre2=6;
          id5=response.reports[i].reportsId;
          grupos2v=response.reports[i].num_grupos;
          hombres2v=response.reports[i].num_h;
          mujeres2v=response.reports[i].num_m;
        } 
        break;       
      }
    }
  }
  //validamos si encontro algo
  if(encontro)
  {
    Alerts.success("Éxito", "Se encontraron datos");
    setFormrows({
      ...formrows,
      semestre0:semestre0,semestre1:semestre1,semestre2:semestre2,encontro:encontro,
      id0:id0,id1:id1,id2:id2,id3:id3,id4:id4,id5:id5,
      grupos0m:grupos0m,hombres0m:hombres0m,mujeres0m:mujeres0m,grupos0v:grupos0v,hombres0v:hombres0v,mujeres0v:mujeres0v,
      grupos1m:grupos1m,hombres1m:hombres1m,mujeres1m:mujeres1m,grupos1v:grupos1v,hombres1v:hombres1v,mujeres1v:mujeres1v,
      grupos2m:grupos2m,hombres2m:hombres2m,mujeres2m:mujeres2m,grupos2v:grupos2v,hombres2v:hombres2v,mujeres2v:mujeres2v
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
  let grupos0m=formrows.grupos0m; 
  let hombres0m=formrows.hombres0m; 
  let mujeres0m=formrows.mujeres0m; 
  let grupos0v=formrows.grupos0v; 
  let hombres0v=formrows.hombres0v; 
  let mujeres0v=formrows.mujeres0v; 
  let grupos1m=formrows.grupos1m; 
  let hombres1m=formrows.hombres1m; 
  let mujeres1m=formrows.mujeres1m; 
  let grupos1v=formrows.grupos1v; 
  let hombres1v=formrows.hombres1v; 
  let mujeres1v=formrows.mujeres1v; 
  let grupos2m=formrows.grupos2m; 
  let hombres2m=formrows.hombres2m; 
  let mujeres2m=formrows.mujeres2m; 
  let grupos2v=formrows.grupos2v; 
  let hombres2v=formrows.hombres2v; 
  let mujeres2v=formrows.mujeres2v;
  let semestre0=formrows.semestre0;
  let semestre1=formrows.semestre1;
  let semestre2=formrows.semestre2;
  //almacenamos la peticion
  let peticion=[];

  //validamos si es update o insert
  if(formrows.encontro)
  {
    //update
    let id0=formrows.id0;
    let id1=formrows.id1;
    let id2=formrows.id2;
    let id3=formrows.id3;
    let id4=formrows.id4;
    let id5=formrows.id5;

    peticion=[
      {reportsId: id0, matricula:enrollId, semestre: parseInt(semestre0) ,turno:1 ,num_grupos: parseInt(grupos0m), num_h: parseInt(hombres0m) ,num_m: parseInt(mujeres0m) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: id1, matricula:enrollId, semestre: parseInt(semestre0) ,turno:2 ,num_grupos: parseInt(grupos0v), num_h: parseInt(hombres0v) ,num_m: parseInt(mujeres0v) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: id2, matricula:enrollId, semestre: parseInt(semestre1) ,turno:1 ,num_grupos: parseInt(grupos1m), num_h: parseInt(hombres1m) ,num_m: parseInt(mujeres1m) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: id3, matricula:enrollId, semestre: parseInt(semestre1) ,turno:2 ,num_grupos: parseInt(grupos1v), num_h: parseInt(hombres1v) ,num_m: parseInt(mujeres1v) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: id4, matricula:enrollId, semestre: parseInt(semestre2) ,turno:1 ,num_grupos: parseInt(grupos2m), num_h: parseInt(hombres2m) ,num_m: parseInt(mujeres2m) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: id5, matricula:enrollId, semestre: parseInt(semestre2) ,turno:2 ,num_grupos: parseInt(grupos2v), num_h: parseInt(hombres2v) ,num_m: parseInt(mujeres2v) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId}
    ];
    //mandamos la peticion update
    const response = await ReportsSchoolEnrollmentService.updateSchoolEnrollment(peticion);
    if (!response.success)
    {
      Alerts.error("Error", "Datos de enrolamiento NO actualizados");
      return;
    }else{
      Alerts.success("Éxito", "Datos de enrolamiento actualizados");
    } 
  }else{
    //insert
    peticion=[
      {reportsId: null,matricula:enrollId, semestre: parseInt(semestre0) ,turno:1 ,num_grupos: parseInt(grupos0m), num_h: parseInt(hombres0m) ,num_m: parseInt(mujeres0m) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: null,matricula:enrollId, semestre: parseInt(semestre0) ,turno:2 ,num_grupos: parseInt(grupos0v), num_h: parseInt(hombres0v) ,num_m: parseInt(mujeres0v) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: null,matricula:enrollId, semestre: parseInt(semestre1) ,turno:1 ,num_grupos: parseInt(grupos1m), num_h: parseInt(hombres1m) ,num_m: parseInt(mujeres1m) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: null,matricula:enrollId, semestre: parseInt(semestre1) ,turno:2 ,num_grupos: parseInt(grupos1v), num_h: parseInt(hombres1v) ,num_m: parseInt(mujeres1v) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: null,matricula:enrollId, semestre: parseInt(semestre2) ,turno:1 ,num_grupos: parseInt(grupos2m), num_h: parseInt(hombres2m) ,num_m: parseInt(mujeres2m) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId},
      {reportsId: null,matricula:enrollId, semestre: parseInt(semestre2) ,turno:2 ,num_grupos: parseInt(grupos2v), num_h: parseInt(hombres2v) ,num_m: parseInt(mujeres2v) ,plantelId: schoolId, cicloId: cicloId, carreraId: careerId}
    ];
    //mandamos la peticion inser
    const response = await ReportsSchoolEnrollmentService.insertSchoolEnrollment(peticion);
    if (!response.success)
    {
      Alerts.error("Error", "Datos de enrolamiento NO guardados");
      return;
    }else{
      Alerts.success("Éxito", "Datos de enrolamiento guardados");
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
            <Form.Item label="Semetre:" name="enrollId" style={{ width: "90%" }} >
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

        <Row >Semestre {formrows.semestre0}</Row>
        <Row >
          <Col {...colProps2}>
            <label>Turno:</label><br/>
            <input type="text" disabled value="Matutino" style={{ width: "65%" }} readOnly/>
          </Col>
          <Col {...colProps2}>
            <label>Grupos:</label><br/>
            <input type="number" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="grupos0m" value={formrows.grupos0m} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
          <Col {...colProps2}>
            <label>Hombres:</label><br/>
            <input type="number" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="hombres0m" value={formrows.hombres0m} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
          <Col {...colProps2}>
            <label>Mujeres:</label><br/>
            <input type="number" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="mujeres0m" value={formrows.mujeres0m} style={{ width: "60%" }} onChange={handleReportsfill}/>      
          </Col>
        </Row>
        <br/>
        <Row >
          <Col {...colProps2}>
              <input type="text" style={{ width: "65%" }} disabled value="Vespertino" readOnly/>
          </Col>
          <Col {...colProps2}>
              <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="grupos0v" value={formrows.grupos0v} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
          <Col {...colProps2}>
              <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="hombres0v" value={formrows.hombres0v} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
          <Col {...colProps2}>
              <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="mujeres0v" value={formrows.mujeres0v} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
        </Row>
        <br/>

        <Row >Semestre {formrows.semestre1}</Row>
        <Row >
          <Col {...colProps2}>
            <label>Turno:</label><br/>
            <input type="text" value="Matutino" disabled style={{ width: "65%" }} readOnly/>  
          </Col>
          <Col {...colProps2}>
            <label>Grupos:</label><br/>
            <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="grupos1m" value={formrows.grupos1m} style={{ width: "60%" }} onChange={handleReportsfill}/>      
          </Col>
          <Col {...colProps2}>
            <label>Hombres:</label><br/>
            <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="hombres1m" value={formrows.hombres1m} style={{ width: "60%" }} onChange={handleReportsfill}/>      
          </Col>
          <Col {...colProps2}>
            <label>Mujeres:</label><br/>
            <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="mujeres1m" value={formrows.mujeres1m} style={{ width: "60%" }} onChange={handleReportsfill}/>       
          </Col>
        </Row>
        <br/>
        <Row >
          <Col {...colProps2}>
              <input type="text" style={{ width: "65%" }} disabled value="Vespertino" readOnly/>
          </Col>
          <Col {...colProps2}>
              <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="grupos1v" value={formrows.grupos1v} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
          <Col {...colProps2}>
              <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="hombres1v" value={formrows.hombres1v} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
          <Col {...colProps2}>
              <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="mujeres1v" value={formrows.mujeres1v} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
        </Row>
        <br/>

        <Row >Semestre {formrows.semestre2}</Row>
        <Row >
          <Col {...colProps2}>
            <label>Turno:</label><br/>
            <input type="text" value="Matutino" disabled style={{ width: "65%" }} readOnly/>
          </Col>
          <Col {...colProps2}>
            <label>Grupos:</label><br/>
            <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="grupos2m" value={formrows.grupos2m} style={{ width: "60%" }} onChange={handleReportsfill}/> 
          </Col>
          <Col {...colProps2}>
            <label>Hombres:</label><br/>
            <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="hombres2m" value={formrows.hombres2m} style={{ width: "60%" }} onChange={handleReportsfill}/>    
          </Col>
          <Col {...colProps2}>
            <label>Mujeres:</label><br/>
            <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="mujeres2m" value={formrows.mujeres2m} style={{ width: "60%" }} onChange={handleReportsfill}/>  
          </Col>
        </Row>
        <br/>
        <Row >
          <Col {...colProps2}>
              <input style={{ width: "65%" }} disabled value="Vespertino" readOnly/>
          </Col>
          <Col {...colProps2}>
              <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="grupos2v" value={formrows.grupos2v} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
          <Col {...colProps2}>
              <input type="number" pattern="\d+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="hombres2v" value={formrows.hombres2v} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
          <Col {...colProps2}>
              <input type="number" pattern="[0-9]+" min="0" max="10000" step="1" required disabled={noSelect.insCaptura} name="mujeres2v" value={formrows.mujeres2v} style={{ width: "60%" }} onChange={handleReportsfill}/>
          </Col>
        </Row>
        <br/>

        <Row {...rowProps}>
          <Col {...colProps2}>
            <div style={{ width: "65%" }}><h5>Totales por carrera</h5></div> 
          </Col>
          <Col {...colProps2}>
            <div style={{ width: "60%" }}>Grupos: {parseInt(formrows.grupos0m)+parseInt(formrows.grupos0v)+parseInt(formrows.grupos1m)+parseInt(formrows.grupos1v)+parseInt(formrows.grupos2m)+parseInt(formrows.grupos2v)}</div>
          </Col>
          <Col {...colProps2}>
            <div style={{ width: "60%" }}>Hombres: {parseInt(formrows.hombres0m)+parseInt(formrows.hombres0v)+parseInt(formrows.hombres1m)+parseInt(formrows.hombres1v)+parseInt(formrows.hombres2m)+parseInt(formrows.hombres2v)}</div>
            </Col>
          <Col {...colProps2}>
            <div style={{ width: "60%" }}>Mujeres: {parseInt(formrows.mujeres0m)+parseInt(formrows.mujeres0v)+parseInt(formrows.mujeres1m)+parseInt(formrows.mujeres1v)+parseInt(formrows.mujeres2m)+parseInt(formrows.mujeres2v)}</div>
          </Col>
        </Row>

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