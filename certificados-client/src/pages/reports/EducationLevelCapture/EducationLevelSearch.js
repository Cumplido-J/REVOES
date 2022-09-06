import React, { useEffect, useState } from "react";

import { Form, Row, Col, Descriptions, Select, Tooltip} from "antd";
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

const style0={style:{border: "1px solid #fff"}};
const style1={style:{border: "1px solid #fff", background: "gray", color: "white"}};
const style2={style:{border: "1px solid #222"}};

const rowProps = {
  style: { marginBottom: "1em" },
};

export default function EducationLevelSearch({ onSubmit }) {
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({ states: [], schools: [], schoolCycles: []});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function getStates() {
      const response = await CatalogService.getStateCatalogs();
      if (!response) return;
      const states = response.states.map((state) => ({ id: state.id, description: state.description1 }));

      setCatalogs({ states, schools: [], schoolCycles:[] });
      setLoading(false);
    }
    getStates();
  }, []);

//para guardar de los los intputs de valores
const [formrows, setFormrows]=useState({encontro:false,
      id:0,
      doc_t_m:0,doc_ec_m:0,doc_es_m:0,mia_t_m:0,mia_ec_m:0,
      mia_es_m:0,esp_t_m:0,esp_ec_m:0,esp_es_m:0,lic_t_m:0,lic_ec_m:0,
      lic_es_m:0,sup_t_m:0,sup_ec_m:0,sup_es_m:0,mto_t_m:0,mto_ec_m:0,
      mto_es_m:0,bac_t_m:0,bac_ec_m:0,bac_es_m:0,tec_t_m:0,tec_ec_m:0,
      tec_es_m:0,com_t_m:0,com_ec_m:0,com_es_m:0,sec_t_m:0,sec_ec_m:0,
      sec_es_m:0,pia_t_m:0,pia_ec_m:0,pia_es_m:0,doc_t:0,doc_ec:0,
      doc_es:0,mia_t:0,mia_ec:0,mia_es:0,esp_t:0,esp_ec:0,esp_es:0,
      lic_t:0,lic_ec:0,lic_es:0,sup_t:0,sup_ec:0,sup_es:0,mto_t:0,
      mto_ec:0,mto_es:0,bac_t:0,bac_ec:0,bac_es:0,tec_t:0,tec_ec:0,
      tec_es:0,com_t:0,com_ec:0,com_es:0,sec_t:0,sec_ec:0,sec_es:0,
      pia_t:0,pia_ec:0,pia_es:0
                                        });

//para guardar los estados del select de matricula y los intputs de valores (si estan deshabilitados o no)
const [noSelect, setNoSelect]=useState({
  selPlan:true,
  selCiclo:true,
  selTurn:true,
  selPlace:true,
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
    form.setFieldsValue({ schoolId: null, cicloId: null, turn: null, place: null });
    //setea el select de plantel y deja vacios los demas
    setCatalogs({ ...catalogs, schools, schoolCycles:[] });
    //habilitamos el select plantel, deshabilitamos lo demas
    setNoSelect({...noSelect,selPlan:false, 
                            selCiclo:true,
                            selTurn:true,
                            selPlace:true,
                            btnBus:true,
                            insCaptura:true,
                            btnActGu:true});
    //reseteamos los inputs a 0
    setFormrows(
      {encontro:false,
        id:0,
        doc_t_m:0,doc_ec_m:0,doc_es_m:0,mia_t_m:0,mia_ec_m:0,
        mia_es_m:0,esp_t_m:0,esp_ec_m:0,esp_es_m:0,lic_t_m:0,lic_ec_m:0,
        lic_es_m:0,sup_t_m:0,sup_ec_m:0,sup_es_m:0,mto_t_m:0,mto_ec_m:0,
        mto_es_m:0,bac_t_m:0,bac_ec_m:0,bac_es_m:0,tec_t_m:0,tec_ec_m:0,
        tec_es_m:0,com_t_m:0,com_ec_m:0,com_es_m:0,sec_t_m:0,sec_ec_m:0,
        sec_es_m:0,pia_t_m:0,pia_ec_m:0,pia_es_m:0,doc_t:0,doc_ec:0,
        doc_es:0,mia_t:0,mia_ec:0,mia_es:0,esp_t:0,esp_ec:0,esp_es:0,
        lic_t:0,lic_ec:0,lic_es:0,sup_t:0,sup_ec:0,sup_es:0,mto_t:0,
        mto_ec:0,mto_es:0,bac_t:0,bac_ec:0,bac_es:0,tec_t:0,tec_ec:0,
        tec_es:0,com_t:0,com_ec:0,com_es:0,sec_t:0,sec_ec:0,sec_es:0,
        pia_t:0,pia_ec:0,pia_es:0
      });
  };
////////////////////////OnCHANGE SELECT de Plantel
  const onChangeSchool = async (schoolId) => {
    //invocamos servicio de ciclos
    const response = await ReportsSchoolEnrollmentService.getSchoolCycles();
    if (!response) return;
    const schoolCycles = response.reports.map((cycle) => (
      { id: cycle.id, description: cycle.name }));
    
    //resetea los selects de los valores
    form.setFieldsValue({ cicloId: null, turn: null, place: null });
    //catgamos los ciclos
    setCatalogs({ ...catalogs, schoolCycles });
    //habilitamos el select ciclo, deshabilitamos lo demas
    setNoSelect({...noSelect, selCiclo:false,
      selTurn:true,
      selPlace:true,
      btnBus:true,
      insCaptura:true,
      btnActGu:true});
    //reseteamos los inputs a 0
    setFormrows(
    {encontro:false,
      id:0,
      doc_t_m:0,doc_ec_m:0,doc_es_m:0,mia_t_m:0,mia_ec_m:0,
      mia_es_m:0,esp_t_m:0,esp_ec_m:0,esp_es_m:0,lic_t_m:0,lic_ec_m:0,
      lic_es_m:0,sup_t_m:0,sup_ec_m:0,sup_es_m:0,mto_t_m:0,mto_ec_m:0,
      mto_es_m:0,bac_t_m:0,bac_ec_m:0,bac_es_m:0,tec_t_m:0,tec_ec_m:0,
      tec_es_m:0,com_t_m:0,com_ec_m:0,com_es_m:0,sec_t_m:0,sec_ec_m:0,
      sec_es_m:0,pia_t_m:0,pia_ec_m:0,pia_es_m:0,doc_t:0,doc_ec:0,
      doc_es:0,mia_t:0,mia_ec:0,mia_es:0,esp_t:0,esp_ec:0,esp_es:0,
      lic_t:0,lic_ec:0,lic_es:0,sup_t:0,sup_ec:0,sup_es:0,mto_t:0,
      mto_ec:0,mto_es:0,bac_t:0,bac_ec:0,bac_es:0,tec_t:0,tec_ec:0,
      tec_es:0,com_t:0,com_ec:0,com_es:0,sec_t:0,sec_ec:0,sec_es:0,
      pia_t:0,pia_ec:0,pia_es:0
    });
  };

////////////////////////OnCHANGE SELECT ciclo
const onChangeCycle = () => {
  //reseteamos el valor del siguiente select a null
  form.setFieldsValue({turn: null, place: null});
  //habilitamos el select matricula
  setNoSelect({...noSelect,  selTurn:false,
    selPlace:true,
    btnBus:true,
    insCaptura:true,
    btnActGu:true});
  //reseteamos los inputs a 0
  setFormrows(
    {encontro:false,
      id:0,
      doc_t_m:0,doc_ec_m:0,doc_es_m:0,mia_t_m:0,mia_ec_m:0,
      mia_es_m:0,esp_t_m:0,esp_ec_m:0,esp_es_m:0,lic_t_m:0,lic_ec_m:0,
      lic_es_m:0,sup_t_m:0,sup_ec_m:0,sup_es_m:0,mto_t_m:0,mto_ec_m:0,
      mto_es_m:0,bac_t_m:0,bac_ec_m:0,bac_es_m:0,tec_t_m:0,tec_ec_m:0,
      tec_es_m:0,com_t_m:0,com_ec_m:0,com_es_m:0,sec_t_m:0,sec_ec_m:0,
      sec_es_m:0,pia_t_m:0,pia_ec_m:0,pia_es_m:0,doc_t:0,doc_ec:0,
      doc_es:0,mia_t:0,mia_ec:0,mia_es:0,esp_t:0,esp_ec:0,esp_es:0,
      lic_t:0,lic_ec:0,lic_es:0,sup_t:0,sup_ec:0,sup_es:0,mto_t:0,
      mto_ec:0,mto_es:0,bac_t:0,bac_ec:0,bac_es:0,tec_t:0,tec_ec:0,
      tec_es:0,com_t:0,com_ec:0,com_es:0,sec_t:0,sec_ec:0,sec_es:0,
      pia_t:0,pia_ec:0,pia_es:0
      });
  };
////////////////////////OnCHANGE SELECT turno
  const onChangeTurn=event=> {
      //reseteamos el valor del siguiente select a null
    form.setFieldsValue({place: null});
    //reseteamos valores de los inputs
    setFormrows({
      ...formrows,
      encontro:false,
      id:0,
      doc_t_m:0,doc_ec_m:0,doc_es_m:0,mia_t_m:0,mia_ec_m:0,
      mia_es_m:0,esp_t_m:0,esp_ec_m:0,esp_es_m:0,lic_t_m:0,lic_ec_m:0,
      lic_es_m:0,sup_t_m:0,sup_ec_m:0,sup_es_m:0,mto_t_m:0,mto_ec_m:0,
      mto_es_m:0,bac_t_m:0,bac_ec_m:0,bac_es_m:0,tec_t_m:0,tec_ec_m:0,
      tec_es_m:0,com_t_m:0,com_ec_m:0,com_es_m:0,sec_t_m:0,sec_ec_m:0,
      sec_es_m:0,pia_t_m:0,pia_ec_m:0,pia_es_m:0,doc_t:0,doc_ec:0,
      doc_es:0,mia_t:0,mia_ec:0,mia_es:0,esp_t:0,esp_ec:0,esp_es:0,
      lic_t:0,lic_ec:0,lic_es:0,sup_t:0,sup_ec:0,sup_es:0,mto_t:0,
      mto_ec:0,mto_es:0,bac_t:0,bac_ec:0,bac_es:0,tec_t:0,tec_ec:0,
      tec_es:0,com_t:0,com_ec:0,com_es:0,sec_t:0,sec_ec:0,sec_es:0,
      pia_t:0,pia_ec:0,pia_es:0
    });

    //validamos que se pueda habilitar el proximo select
    if(event=='matutino' || event=='vespertino')
    {
      setNoSelect({...noSelect, selPlace:false,
        btnBus:true,
        insCaptura:true,
        btnActGu:true});
    }else
    {
      setNoSelect({...noSelect,selPlace:true,
        btnBus:true,
        insCaptura:true,
        btnActGu:true});
    }
  };
////////////////////////OnCHANGE SELECT Plaza
const onChangePlace=event=> {
  //vaciamos los inputs
  setFormrows({
    ...formrows,
    encontro:false,
    id:0,
    doc_t_m:0,doc_ec_m:0,doc_es_m:0,mia_t_m:0,mia_ec_m:0,
    mia_es_m:0,esp_t_m:0,esp_ec_m:0,esp_es_m:0,lic_t_m:0,lic_ec_m:0,
    lic_es_m:0,sup_t_m:0,sup_ec_m:0,sup_es_m:0,mto_t_m:0,mto_ec_m:0,
    mto_es_m:0,bac_t_m:0,bac_ec_m:0,bac_es_m:0,tec_t_m:0,tec_ec_m:0,
    tec_es_m:0,com_t_m:0,com_ec_m:0,com_es_m:0,sec_t_m:0,sec_ec_m:0,
    sec_es_m:0,pia_t_m:0,pia_ec_m:0,pia_es_m:0,doc_t:0,doc_ec:0,
    doc_es:0,mia_t:0,mia_ec:0,mia_es:0,esp_t:0,esp_ec:0,esp_es:0,
    lic_t:0,lic_ec:0,lic_es:0,sup_t:0,sup_ec:0,sup_es:0,mto_t:0,
    mto_ec:0,mto_es:0,bac_t:0,bac_ec:0,bac_es:0,tec_t:0,tec_ec:0,
    tec_es:0,com_t:0,com_ec:0,com_es:0,sec_t:0,sec_ec:0,sec_es:0,
    pia_t:0,pia_ec:0,pia_es:0
  });
  //revisamos que se pueda habilitar el siguiente boton
  if(event=='Docente' || event=='No docente' || event=='Directivo')
  {
    //habilitamos el boton buscar y deshabilitamos lo demas
    setNoSelect({...noSelect,btnBus:false,
      insCaptura:true,
      btnActGu:true});
  }else
  {
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
  let cicloId=form.getFieldsValue().cicloId;
  let turn=form.getFieldsValue().turn;
  let place=form.getFieldsValue().place;
  //variables para almacenar los valores del get
  let doc_t_m=0;
  let doc_ec_m=0;
  let doc_es_m=0;
  let mia_t_m=0;
  let mia_ec_m=0;
  let mia_es_m=0;
  let esp_t_m=0;
  let esp_ec_m=0;
  let esp_es_m=0;
  let lic_t_m=0;
  let lic_ec_m=0;
  let lic_es_m=0;
  let sup_t_m=0;
  let sup_ec_m=0;
  let sup_es_m=0;
  let mto_t_m=0;
  let mto_ec_m=0;
  let mto_es_m=0;
  let bac_t_m=0;
  let bac_ec_m=0;
  let bac_es_m=0;
  let tec_t_m=0;
  let tec_ec_m=0;
  let tec_es_m=0;
  let com_t_m=0;
  let com_ec_m=0;
  let com_es_m=0;
  let sec_t_m=0;
  let sec_ec_m=0;
  let sec_es_m=0;
  let pia_t_m=0;
  let pia_ec_m=0;
  let pia_es_m=0;
  let doc_t=0;
  let doc_ec=0;
  let doc_es=0;
  let mia_t=0;
  let mia_ec=0;
  let mia_es=0;
  let esp_t=0;
  let esp_ec=0;
  let esp_es=0;
  let lic_t=0;
  let lic_ec=0;
  let lic_es=0;
  let sup_t=0;
  let sup_ec=0;
  let sup_es=0;
  let mto_t=0;
  let mto_ec=0;
  let mto_es=0;
  let bac_t=0;
  let bac_ec=0;
  let bac_es=0;
  let tec_t=0;
  let tec_ec=0;
  let tec_es=0;
  let com_t=0;
  let com_ec=0;
  let com_es=0;
  let sec_t=0;
  let sec_ec=0;
  let sec_es=0;
  let pia_t=0;
  let pia_ec=0;
  let pia_es=0;
  let id=0;

  
  //guardamos si encontro datos
  let encontro=false;
  const response = await ReportsSchoolEnrollmentService.getEducationLevel(stateId,schoolId,cicloId,turn,place);
  if (!response) return;
  //deshabilitamos habilitamos todo
  setNoSelect({...noSelect,
    insCaptura:false,
    btnActGu:false});
//iteramos en la respuesta
  for (let i = 0; i < response.reports.length; i++) {
    encontro=true;
    id=response.reports[i].reportes_id;
    doc_t_m=response.reports[i].doc_t_m;
    doc_ec_m=response.reports[i].doc_ec_m;
    doc_es_m=response.reports[i].doc_es_m;
    mia_t_m=response.reports[i].mia_t_m;
    mia_ec_m=response.reports[i].mia_ec_m;
    mia_es_m=response.reports[i].mia_es_m;
    esp_t_m=response.reports[i].esp_t_m;
    esp_ec_m=response.reports[i].esp_ec_m;
    esp_es_m=response.reports[i].esp_es_m;
    lic_t_m=response.reports[i].lic_t_m;
    lic_ec_m=response.reports[i].lic_ec_m;
    lic_es_m=response.reports[i].lic_es_m;
    sup_t_m=response.reports[i].sup_t_m;
    sup_ec_m=response.reports[i].sup_ec_m;
    sup_es_m=response.reports[i].sup_es_m;
    mto_t_m=response.reports[i].mto_t_m;
    mto_ec_m=response.reports[i].mto_ec_m;
    mto_es_m=response.reports[i].mto_es_m;
    bac_t_m=response.reports[i].bac_t_m;
    bac_ec_m=response.reports[i].bac_ec_m;
    bac_es_m=response.reports[i].bac_es_m;
    tec_t_m=response.reports[i].tec_t_m;
    tec_ec_m=response.reports[i].tec_ec_m;
    tec_es_m=response.reports[i].tec_es_m;
    com_t_m=response.reports[i].com_t_m;
    com_ec_m=response.reports[i].com_ec_m;
    com_es_m=response.reports[i].com_es_m;
    sec_t_m=response.reports[i].sec_t_m;
    sec_ec_m=response.reports[i].sec_ec_m;
    sec_es_m=response.reports[i].sec_es_m;
    pia_t_m=response.reports[i].pia_t_m;
    pia_ec_m=response.reports[i].pia_ec_m;
    pia_es_m=response.reports[i].pia_es_m;
    doc_t=response.reports[i].doc_t;
    doc_ec=response.reports[i].doc_ec;
    doc_es=response.reports[i].doc_es;
    mia_t=response.reports[i].mia_t;
    mia_ec=response.reports[i].mia_ec;
    mia_es=response.reports[i].mia_es;
    esp_t=response.reports[i].esp_t;
    esp_ec=response.reports[i].esp_ec;
    esp_es=response.reports[i].esp_es;
    lic_t=response.reports[i].lic_t;
    lic_ec=response.reports[i].lic_ec;
    lic_es=response.reports[i].lic_es;
    sup_t=response.reports[i].sup_t;
    sup_ec=response.reports[i].sup_ec;
    sup_es=response.reports[i].sup_es;
    mto_t=response.reports[i].mto_t;
    mto_ec=response.reports[i].mto_ec;
    mto_es=response.reports[i].mto_es;
    bac_t=response.reports[i].bac_t;
    bac_ec=response.reports[i].bac_ec;
    bac_es=response.reports[i].bac_es;
    tec_t=response.reports[i].tec_t;
    tec_ec=response.reports[i].tec_ec;
    tec_es=response.reports[i].tec_es;
    com_t=response.reports[i].com_t;
    com_ec=response.reports[i].com_ec;
    com_es=response.reports[i].com_es;
    sec_t=response.reports[i].sec_t;
    sec_ec=response.reports[i].sec_ec;
    sec_es=response.reports[i].sec_es;
    pia_t=response.reports[i].pia_t;
    pia_ec=response.reports[i].pia_ec;
    pia_es=response.reports[i].pia_es;
    console.log("respuestaaaaaaaaaaaaa");
    console.log(response.reports[i]);
  }
  //validamos si encontro algo
  if(encontro)
  {
    Alerts.success("Éxito", "Se encontraron datos");
    setFormrows({
      ...formrows,
      encontro:encontro,
      id:id,
      doc_t_m:doc_t_m,doc_ec_m:doc_ec_m,doc_es_m:doc_es_m,mia_t_m:mia_t_m,mia_ec_m:mia_ec_m,mia_es_m:mia_es_m,
      esp_t_m:esp_t_m,esp_ec_m:esp_ec_m,esp_es_m:esp_es_m,lic_t_m:lic_t_m,lic_ec_m:lic_ec_m,lic_es_m:lic_es_m,
      sup_t_m:sup_t_m,sup_ec_m:sup_ec_m,sup_es_m:sup_es_m,mto_t_m:mto_t_m,mto_ec_m:mto_ec_m,mto_es_m:mto_es_m,
      bac_t_m:bac_t_m,bac_ec_m:bac_ec_m,bac_es_m:bac_es_m,tec_t_m:tec_t_m,tec_ec_m:tec_ec_m,tec_es_m:tec_es_m,
      com_t_m:com_t_m,com_ec_m:com_ec_m,com_es_m:com_es_m,sec_t_m:sec_t_m,sec_ec_m:sec_ec_m,sec_es_m:sec_es_m,
      pia_t_m:pia_t_m,pia_ec_m:pia_ec_m,pia_es_m:pia_es_m,doc_t:doc_t,doc_ec:doc_ec,doc_es:doc_es,
      mia_t:mia_t,mia_ec:mia_ec,mia_es:mia_es,esp_t:esp_t,esp_ec:esp_ec,esp_es:esp_es,
      lic_t:lic_t,lic_ec:lic_ec,lic_es:lic_es,sup_t:sup_t,sup_ec:sup_ec,sup_es:sup_es,
      mto_t:mto_t,mto_ec:mto_ec,mto_es:mto_es,bac_t:bac_t,bac_ec:bac_ec,bac_es:bac_es,
      tec_t:tec_t,tec_ec:tec_ec,tec_es:tec_es,com_t:com_t,com_ec:com_ec,com_es:com_es,
      sec_t:sec_t,sec_ec:sec_ec,sec_es:sec_es,pia_t:pia_t,pia_ec:pia_ec,pia_es:pia_es
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
  let cicloId=form.getFieldsValue().cicloId;
  let stateId=form.getFieldsValue().stateId;
  let turn=form.getFieldsValue().turn;
  let place=form.getFieldsValue().place;

  //variables para almacenar los valores del get
  let doc_t_m=formrows.doc_t_m;
  let doc_ec_m=formrows.doc_ec_m;
  let doc_es_m=formrows.doc_es_m;
  let mia_t_m=formrows.mia_t_m;
  let mia_ec_m=formrows.mia_ec_m;
  let mia_es_m=formrows.mia_es_m;
  let esp_t_m=formrows.esp_t_m;
  let esp_ec_m=formrows.esp_ec_m;
  let esp_es_m=formrows.esp_es_m;
  let lic_t_m=formrows.lic_t_m;
  let lic_ec_m=formrows.lic_ec_m;
  let lic_es_m=formrows.lic_es_m;
  let sup_t_m=formrows.sup_t_m;
  let sup_ec_m=formrows.sup_ec_m;
  let sup_es_m=formrows.sup_es_m;
  let mto_t_m=formrows.mto_t_m;
  let mto_ec_m=formrows.mto_ec_m;
  let mto_es_m=formrows.mto_es_m;
  let bac_t_m=formrows.bac_t_m;
  let bac_ec_m=formrows.bac_ec_m;
  let bac_es_m=formrows.bac_es_m;
  let tec_t_m=formrows.tec_t_m;
  let tec_ec_m=formrows.tec_ec_m;
  let tec_es_m=formrows.tec_es_m;
  let com_t_m=formrows.com_t_m;
  let com_ec_m=formrows.com_ec_m;
  let com_es_m=formrows.com_es_m;
  let sec_t_m=formrows.sec_t_m;
  let sec_ec_m=formrows.sec_ec_m;
  let sec_es_m=formrows.sec_es_m;
  let pia_t_m=formrows.pia_t_m;
  let pia_ec_m=formrows.pia_ec_m;
  let pia_es_m=formrows.pia_es_m;
  let doc_t=formrows.doc_t;
  let doc_ec=formrows.doc_ec;
  let doc_es=formrows.doc_es;
  let mia_t=formrows.mia_t;
  let mia_ec=formrows.mia_ec;
  let mia_es=formrows.mia_es;
  let esp_t=formrows.esp_t;
  let esp_ec=formrows.esp_ec;
  let esp_es=formrows.esp_es;
  let lic_t=formrows.lic_t;
  let lic_ec=formrows.lic_ec;
  let lic_es=formrows.lic_es;
  let sup_t=formrows.sup_t;
  let sup_ec=formrows.sup_ec;
  let sup_es=formrows.sup_es;
  let mto_t=formrows.mto_t;
  let mto_ec=formrows.mto_ec;
  let mto_es=formrows.mto_es;
  let bac_t=formrows.bac_t;
  let bac_ec=formrows.bac_ec;
  let bac_es=formrows.bac_es;
  let tec_t=formrows.tec_t;
  let tec_ec=formrows.tec_ec;
  let tec_es=formrows.tec_es;
  let com_t=formrows.com_t;
  let com_ec=formrows.com_ec;
  let com_es=formrows.com_es;
  let sec_t=formrows.sec_t;
  let sec_ec=formrows.sec_ec;
  let sec_es=formrows.sec_es;
  let pia_t=formrows.pia_t;
  let pia_ec=formrows.pia_ec;
  let pia_es=formrows.pia_es;
  //almacenamos la peticion
  let peticion=[];

  //validamos si es update o insert
  if(formrows.encontro)
  {
    //update
    let id=formrows.id;


    peticion=[
      {
        reportes_id: id,
        doc_t_m:parseInt(doc_t_m),doc_ec_m:parseInt(doc_ec_m),doc_es_m:parseInt(doc_es_m),mia_t_m:parseInt(mia_t_m),mia_ec_m:parseInt(mia_ec_m),mia_es_m:parseInt(mia_es_m),
        esp_t_m:parseInt(esp_t_m),esp_ec_m:parseInt(esp_ec_m),esp_es_m:parseInt(esp_es_m),lic_t_m:parseInt(lic_t_m),lic_ec_m:parseInt(lic_ec_m),lic_es_m:parseInt(lic_es_m),
        sup_t_m:parseInt(sup_t_m),sup_ec_m:parseInt(sup_ec_m),sup_es_m:parseInt(sup_es_m),mto_t_m:parseInt(mto_t_m),mto_ec_m:parseInt(mto_ec_m),mto_es_m:parseInt(mto_es_m),
        bac_t_m:parseInt(bac_t_m),bac_ec_m:parseInt(bac_ec_m),bac_es_m:parseInt(bac_es_m),tec_t_m:parseInt(tec_t_m),tec_ec_m:parseInt(tec_ec_m),tec_es_m:parseInt(tec_es_m),
        com_t_m:parseInt(com_t_m),com_ec_m:parseInt(com_ec_m),com_es_m:parseInt(com_es_m),sec_t_m:parseInt(sec_t_m),sec_ec_m:parseInt(sec_ec_m),sec_es_m:parseInt(sec_es_m),
        pia_t_m:parseInt(pia_t_m),pia_ec_m:parseInt(pia_ec_m),pia_es_m:parseInt(pia_es_m),doc_t:parseInt(doc_t),doc_ec:parseInt(doc_ec),doc_es:parseInt(doc_es),
        mia_t:parseInt(mia_t),mia_ec:parseInt(mia_ec),mia_es:parseInt(mia_es),esp_t:parseInt(esp_t),esp_ec:parseInt(esp_ec),esp_es:parseInt(esp_es),
        lic_t:parseInt(lic_t),lic_ec:parseInt(lic_ec),lic_es:parseInt(lic_es),sup_t:parseInt(sup_t),sup_ec:parseInt(sup_ec),sup_es:parseInt(sup_es),
        mto_t:parseInt(mto_t),mto_ec:parseInt(mto_ec),mto_es:parseInt(mto_es),bac_t:parseInt(bac_t),bac_ec:parseInt(bac_ec),bac_es:parseInt(bac_es),
        tec_t:parseInt(tec_t),tec_ec:parseInt(tec_ec),tec_es:parseInt(tec_es),com_t:parseInt(com_t),com_ec:parseInt(com_ec),com_es:parseInt(com_es),
        sec_t:parseInt(sec_t),sec_ec:parseInt(sec_ec),sec_es:parseInt(sec_es),pia_t:parseInt(pia_t),pia_ec:parseInt(pia_ec),pia_es:parseInt(pia_es)
      }
    ];
    //mandamos la peticion update
    const response = await ReportsSchoolEnrollmentService.updateEducationLevel(peticion);
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
      {
        reportes_id: null,
        doc_t_m:parseInt(doc_t_m),doc_ec_m:parseInt(doc_ec_m),doc_es_m:parseInt(doc_es_m),mia_t_m:parseInt(mia_t_m),mia_ec_m:parseInt(mia_ec_m),mia_es_m:parseInt(mia_es_m),
        esp_t_m:parseInt(esp_t_m),esp_ec_m:parseInt(esp_ec_m),esp_es_m:parseInt(esp_es_m),lic_t_m:parseInt(lic_t_m),lic_ec_m:parseInt(lic_ec_m),lic_es_m:parseInt(lic_es_m),
        sup_t_m:parseInt(sup_t_m),sup_ec_m:parseInt(sup_ec_m),sup_es_m:parseInt(sup_es_m),mto_t_m:parseInt(mto_t_m),mto_ec_m:parseInt(mto_ec_m),mto_es_m:parseInt(mto_es_m),
        bac_t_m:parseInt(bac_t_m),bac_ec_m:parseInt(bac_ec_m),bac_es_m:parseInt(bac_es_m),tec_t_m:parseInt(tec_t_m),tec_ec_m:parseInt(tec_ec_m),tec_es_m:parseInt(tec_es_m),
        com_t_m:parseInt(com_t_m),com_ec_m:parseInt(com_ec_m),com_es_m:parseInt(com_es_m),sec_t_m:parseInt(sec_t_m),sec_ec_m:parseInt(sec_ec_m),sec_es_m:parseInt(sec_es_m),
        pia_t_m:parseInt(pia_t_m),pia_ec_m:parseInt(pia_ec_m),pia_es_m:parseInt(pia_es_m),doc_t:parseInt(doc_t),doc_ec:parseInt(doc_ec),doc_es:parseInt(doc_es),
        mia_t:parseInt(mia_t),mia_ec:parseInt(mia_ec),mia_es:parseInt(mia_es),esp_t:parseInt(esp_t),esp_ec:parseInt(esp_ec),esp_es:parseInt(esp_es),
        lic_t:parseInt(lic_t),lic_ec:parseInt(lic_ec),lic_es:parseInt(lic_es),sup_t:parseInt(sup_t),sup_ec:parseInt(sup_ec),sup_es:parseInt(sup_es),
        mto_t:parseInt(mto_t),mto_ec:parseInt(mto_ec),mto_es:parseInt(mto_es),bac_t:parseInt(bac_t),bac_ec:parseInt(bac_ec),bac_es:parseInt(bac_es),
        tec_t:parseInt(tec_t),tec_ec:parseInt(tec_ec),tec_es:parseInt(tec_es),com_t:parseInt(com_t),com_ec:parseInt(com_ec),com_es:parseInt(com_es),
        sec_t:parseInt(sec_t),sec_ec:parseInt(sec_ec),sec_es:parseInt(sec_es),pia_t:parseInt(pia_t),pia_ec:parseInt(pia_ec),pia_es:parseInt(pia_es),
        plantel_id: schoolId, ciclo_id: cicloId, estado_id: stateId, turno:turn, plaza:place
      }
    ];
    //mandamos la peticion inser
    const response = await ReportsSchoolEnrollmentService.insertEducationLevel(peticion);
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
            <Form.Item label="Ciclo:" name="cicloId">
              <SearchSelect disabled={noSelect.selCiclo} required dataset={catalogs.schoolCycles}  onChange={onChangeCycle}/>
            </Form.Item>
          </Col>
        </Row>


        <Row>
          <Col {...colProps}>
            <Form.Item label="Turno:" name="turn" style={{ width: "90%" }} >
              <Select disabled={noSelect.selTurn} onChange={onChangeTurn}>
                <Option value="matutino">matutino</Option>
                <Option value="vespertino">vespertino</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Plaza:" name="place" style={{ width: "90%" }} >
              <Select disabled={noSelect.selPlace} onChange={onChangePlace}>
                <Option value="Docente">Docente</Option>
                <Option value="No docente">No docente</Option>
                <Option value="Directivo">Directivo</Option>
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
            <Descriptions title="Nivel Estudios:">
            </Descriptions>
          </Col>
        </Row>

        <Row >
          <Col span="2" {...style0}>&nbsp;</Col>
          <Col span="6" {...style1} >Posgrado</Col>
          <Col span="2" {...style1}>&nbsp;</Col>
          <Col span="4" {...style1}>Normal</Col>
          <Col span="6" {...style1}>Medio superior</Col>
          <Col span="4" {...style1}>Medio B&aacute;sico</Col>
        </Row>
        <Row>
          <Col span="2" {...style0}>&nbsp;</Col>
          <Col span="2"  {...style1}>Doctorado</Col>
          <Col span="2"  {...style1}>Maestria</Col>
          <Col span="2"  {...style1}>Especialidad</Col>
          <Col span="2"  {...style1}>Licenciatura</Col>
          <Col span="2"  {...style1}>Superior</Col>
          <Col span="2"  {...style1}>Maestro</Col>
          <Col span="2"  {...style1}>Bachillerato</Col>
          <Col span="2"  {...style1}>Tecnico</Col>
          <Col span="2"  {...style1}>Comercial</Col>
          <Col span="2"  {...style1}>Secundaria</Col>
          <Col span="2"  {...style1}>Primaria</Col>
        </Row>
        <Row>
          <Col span="2" {...style0}>&nbsp;</Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="TITULADO">T</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS CONCLUIDOS">EC</Tooltip></Col>
              <Col span="8"  align="center" {...style1}><Tooltip placement="top" title="ESTUDIOS SIN CONCLUIR">ES</Tooltip></Col>
            </Row>
          </Col>
        </Row>





        <Row>
        <Col span="2" {...style1}>Hombres</Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="doc_t" value={formrows.doc_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="doc_ec" value={formrows.doc_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="doc_es" value={formrows.doc_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mia_t" value={formrows.mia_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mia_ec" value={formrows.mia_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mia_es" value={formrows.mia_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="esp_t" value={formrows.esp_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="esp_ec" value={formrows.esp_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="esp_es" value={formrows.esp_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="lic_t" value={formrows.lic_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="lic_ec" value={formrows.lic_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="lic_es" value={formrows.lic_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sup_t" value={formrows.sup_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sup_ec" value={formrows.sup_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sup_es" value={formrows.sup_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mto_t" value={formrows.mto_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mto_ec" value={formrows.mto_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mto_es" value={formrows.mto_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="bac_t" value={formrows.bac_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="bac_ec" value={formrows.bac_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="bac_es" value={formrows.bac_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="tec_t" value={formrows.tec_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="tec_ec" value={formrows.tec_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="tec_es" value={formrows.tec_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="com_t" value={formrows.com_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="com_ec" value={formrows.com_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="com_es" value={formrows.com_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sec_t" value={formrows.sec_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sec_ec" value={formrows.sec_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sec_es" value={formrows.sec_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="pia_t" value={formrows.pia_t} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="pia_ec" value={formrows.pia_ec} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="pia_es" value={formrows.pia_es} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
        <Col span="2" {...style1}>Mujeres</Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="doc_t_m" value={formrows.doc_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="doc_ec_m" value={formrows.doc_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="doc_es_m" value={formrows.doc_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mia_t_m" value={formrows.mia_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mia_ec_m" value={formrows.mia_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mia_es_m" value={formrows.mia_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="esp_t_m" value={formrows.esp_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="esp_ec_m" value={formrows.esp_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="esp_es_m" value={formrows.esp_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="lic_t_m" value={formrows.lic_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="lic_ec_m" value={formrows.lic_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="lic_es_m" value={formrows.lic_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sup_t_m" value={formrows.sup_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sup_ec_m" value={formrows.sup_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sup_es_m" value={formrows.sup_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mto_t_m" value={formrows.mto_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mto_ec_m" value={formrows.mto_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="mto_es_m" value={formrows.mto_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="bac_t_m" value={formrows.bac_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="bac_ec_m" value={formrows.bac_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="bac_es_m" value={formrows.bac_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="tec_t_m" value={formrows.tec_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="tec_ec_m" value={formrows.tec_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="tec_es_m" value={formrows.tec_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="com_t_m" value={formrows.com_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="com_ec_m" value={formrows.com_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="com_es_m" value={formrows.com_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sec_t_m" value={formrows.sec_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sec_ec_m" value={formrows.sec_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="sec_es_m" value={formrows.sec_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="pia_t_m" value={formrows.pia_t_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="pia_ec_m" value={formrows.pia_ec_m} onChange={handleReportsfill}/>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <input type="number" min="0" max="100" required disabled={noSelect.insCaptura} name="pia_es_m" value={formrows.pia_es_m} onChange={handleReportsfill}/>
              </Col>
            </Row>
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
        <Col span="2" >&nbsp;</Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.doc_t_m)+parseInt(formrows.doc_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.doc_ec_m)+parseInt(formrows.doc_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.doc_es_m)+parseInt(formrows.doc_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
            <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.mia_t_m)+parseInt(formrows.mia_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.mia_ec_m)+parseInt(formrows.mia_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.mia_es_m)+parseInt(formrows.mia_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.esp_t_m)+parseInt(formrows.esp_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.esp_ec_m)+parseInt(formrows.esp_ec)}</div>

              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.esp_es_m)+parseInt(formrows.esp_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.lic_t_m)+parseInt(formrows.lic_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.lic_ec_m)+parseInt(formrows.lic_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.lic_es_m)+parseInt(formrows.lic_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.sup_t_m)+parseInt(formrows.sup_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.sup_ec_m)+parseInt(formrows.sup_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.sup_es_m)+parseInt(formrows.sup_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.mto_t_m)+parseInt(formrows.mto_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.mto_ec_m)+parseInt(formrows.mto_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.mto_es_m)+parseInt(formrows.mto_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.bac_t_m)+parseInt(formrows.bac_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.bac_ec_m)+parseInt(formrows.bac_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.bac_es_m)+parseInt(formrows.bac_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.tec_t_m)+parseInt(formrows.tec_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.tec_ec_m)+parseInt(formrows.tec_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.tec_es_m)+parseInt(formrows.tec_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.com_t_m)+parseInt(formrows.com_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.com_ec_m)+parseInt(formrows.com_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.com_es_m)+parseInt(formrows.com_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.sec_t_m)+parseInt(formrows.sec_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.sec_ec_m)+parseInt(formrows.sec_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.sec_es_m)+parseInt(formrows.sec_es)}</div>
              </Col>
            </Row>
          </Col>
          <Col span="2">
          <Row> 
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.pia_t_m)+parseInt(formrows.pia_t)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.pia_ec_m)+parseInt(formrows.pia_ec)}</div>
              </Col>
              <Col span="8"  align="center" {...style2}>
                <div>{parseInt(formrows.pia_es_m)+parseInt(formrows.pia_es)}</div>
              </Col>
            </Row>
          </Col>
        </Row>





        <Row {...rowProps}>
          <Col {...colProps}>
            <br/>
            <PrimaryButton loading={loading} disabled={noSelect.btnActGu} icon={<SaveOutlined />} onClick={onClickActInsertar}>
              Actualizar/Guardar
            </PrimaryButton>
          </Col>
        </Row>


      </Form>
    </Loading>
  );
}