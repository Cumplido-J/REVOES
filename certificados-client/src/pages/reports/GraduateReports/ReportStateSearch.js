import React, { useEffect, useState } from "react";

import { Form, Row, Col, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Loading,  SearchSelect, ButtonCustom, ButtonExcelReportGraduatedState, ButtonExcelReportGraduatedSchool, ButtonExcelReportGraduatedSchoolCareer } from "../../../shared/components";
import Alerts from "../../../shared/alerts";
import ReportsSchoolEnrollmentService from "../../../service/ReportsSchoolEnrollmentService";
import ReportStateTable from "./ReportStateTable";
import ReportSchoolTable from "./ReportSchoolTable";
import ReportCareerTable from "./ReportCareerTable";

const { Option } = Select;

const colProps = {
  xs: { span: 24 },
  md: { span: 6 },
};

const rowProps = {
  style: { marginBottom: "1em" },
};

export default function ReportStateSearch({ onSubmit }) {
  const hoy = new Date();
  const f = hoy.getDate() + '-' + (hoy.getMonth() + 1 )+ '-' + hoy.getFullYear();
  const h = hoy.getHours()+'-'+hoy.getMinutes()+'-'+hoy.getSeconds();
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({  schoolCycles: []});
  const [loading, setLoading] = useState(true);
  const [stateReport, setStateReport] = useState([]);
  const [stateSchoolReport, setStateSchoolReport] = useState([]);
  const [stateSchoolCareerReport, setStateSchoolCareerReport] = useState([]);

  //para guardar los estados del select de matricula y los intputs de valores (si estan deshabilitados o no)
  const [noSelect, setNoSelect]=useState({
    selCiclo:true,
    selMatr:true,
    selTipEsc:true,
    btnBus:true
  });

  //Cargamos los ciclos
  useEffect(() => {
    async function getschoolCycles() {
      //invocamos servicio de ciclos
      const response = await ReportsSchoolEnrollmentService.getSchoolCycles();
      if (!response) return;
      const schoolCycles = response.reports.map((cycle) => (
        { id: cycle.id, description: cycle.name }));
      
      //reseteamos los selects
      form.setFieldsValue({ cicloId: null, enrollId: null , schoolType: null});
      //cargamos los ciclos
      setCatalogs({ ...catalogs, schoolCycles });
       //habilitamos el select ciclo y deshabilitamos lo demas
      setNoSelect({...noSelect, 
        selCiclo:false,      
        selMatr:true,
        selTipEsc:true,
        btnBus:true
      });
      //vaciamos la tabla 1
      setStateReport([]);
      //vaciamos la tabla 2
      setStateSchoolReport([]);
      // vaciamos tabla 3
      setStateSchoolCareerReport([]);
      setLoading(false);
    }
    getschoolCycles();
  }, []);

  ///////------------------------------CARGA LOS SELECTS-----------------------------------------------
  ////////////////////////OnCHANGE SELECT ciclo
  const onChangeCycle = () => {
    //reseteamos el valor del siguiente select a null
    form.setFieldsValue({ enrollId: null, schoolType: null});
    //habilitamos el select matricula y deshabilitamos lo demas
    setNoSelect({...noSelect,selMatr: false, 
                selTipEsc:true,btnBus:true
              });
    //vaciamos la tabla
    setStateReport([]);
    //vaciamos la tabla 2
    setStateSchoolReport([]);
    // vaciamos tabla 3
    setStateSchoolCareerReport([]);
  };
  ////////////////////////OnCHANGE SELECT MAtricula
  const onChangeEnrollment=event=> {
    //reseteamos el valor del siguiente select a null
    form.setFieldsValue({ schoolType: null});
    //habilitamos el slect tipo escuela y deshabilitamos lo demas
    setNoSelect({...noSelect,selTipEsc:false,btnBus:true});
    //vaciamos la tabla
    setStateReport([]);
    //vaciamos la tabla 2
    setStateSchoolReport([]);
    // vaciamos tabla 3
    setStateSchoolCareerReport([]);
  };
  ////////////////////////OnCHANGE SELECT schooltype
  const onChangeSchoolType=event=> {
    //habilitamos el boton buscar y deshabilitamos lo demas
    setNoSelect({...noSelect,btnBus:false});
    //vaciamos la tabla
    setStateReport([]);
    //vaciamos la tabla 2
    setStateSchoolReport([]);
    // vaciamos tabla 3
    setStateSchoolCareerReport([]);
  };
  ////////////////////////OnCLICK btnBuscar
  const onClickBuscar = async () => {
    setLoading(true);
    //vaciamos la tabla
    setStateReport([]);
    //vaciamos la tabla 2
    setStateSchoolReport([]);
    // vaciamos tabla 3
    setStateSchoolCareerReport([]);
    let cicloId=form.getFieldsValue().cicloId;
    let enrollId=form.getFieldsValue().enrollId;
    let schoolType=form.getFieldsValue().schoolType;

    //guardamos si encontro datos
    let encontro=false;
    const response = await ReportsSchoolEnrollmentService.getStateGraduates(schoolType, cicloId, enrollId);
    if (!response)
    {
      Alerts.warning("Éxito", "No se encontraron datos");
      return;
    }
    setStateReport(response.reports);
    setLoading(false);
    //validamos si encontro algo
    if(response.reports.length>0)
    {
      Alerts.success("Éxito", "Se encontraron datos");
    }else{
      Alerts.warning("Éxito", "No se encontraron datos");
    }
  };


  ////////////////////////OnCLICK lnkEstado
  const onClickEstado = async (idEntidad) => {
    setLoading(true);
    //vaciamos la tabla 2
    setStateSchoolReport([]);
    let cicloId=form.getFieldsValue().cicloId;
    let enrollId=form.getFieldsValue().enrollId;
    let schoolType=form.getFieldsValue().schoolType;

    //guardamos si encontro datos
    let encontro=false;
    const response = await ReportsSchoolEnrollmentService.getStateSchoolGraduates(schoolType, cicloId, enrollId, idEntidad);
    if (!response)
    {
      Alerts.warning("Éxito", "No se encontraron datos");
      return;
    }
    setStateSchoolReport(response.reports);
    setLoading(false);
    //validamos si encontro algo
    if(response.reports.length>0)
    {
      Alerts.success("Éxito", "Se encontraron datos");
    }else{
      Alerts.warning("Éxito", "No se encontraron datos");
    }
  };

  ////////////////////////OnCLICK plantel
  const onClickPlantel = async (idPlantel) => {
    setLoading(true);
    //vaciamos la tabla 3
    setStateSchoolCareerReport([]);
    let cicloId=form.getFieldsValue().cicloId;
    let enrollId=form.getFieldsValue().enrollId;

    //guardamos si encontro datos
    let encontro=false;
    const response = await ReportsSchoolEnrollmentService.getStateSchoolCareerGraduates(cicloId, enrollId, idPlantel)
    if (!response)
    {
      Alerts.warning("Éxito", "No se encontraron datos");
      return;
    }
    setStateSchoolCareerReport(response.reports);
    setLoading(false);
    //validamos si encontro algo
    if(response.reports.length>0)
    {
      Alerts.success("Éxito", "Se encontraron datos");
    }else{
      Alerts.warning("Éxito", "No se encontraron datos");
    }
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
    <>
      <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
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
            <Form.Item label="Tipo de Plantel:" name="schoolType" style={{ width: "90%" }} >
              <Select disabled={noSelect.selTipEsc} onChange={onChangeSchoolType}>
                <Option value="EMS">EMSaD</Option>
                <Option value="ETC">CECyTE</Option>
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

      </Form>
      <br/>
      <br/>
      <br/>
      <h5>Reporte por estado</h5>
      <br/>
      <br/>
      <br/>
      <Row>
        <Col {...colProps}>

            <ButtonExcelReportGraduatedState dataset={stateReport} filename={`ReporteEgrTituladosEstado_${f}_${h}`} loading={loading} />
        </Col>
      </Row>
      <Loading loading={loading} >
        <ReportStateTable dataset={stateReport} onClickEstado={onClickEstado}/>
        <br/>
        <br/>
        <br/>
        <h5>Reporte por plantel</h5>
        <br/>
        <br/>
        <br/>
        <Col {...colProps}>
            <ButtonExcelReportGraduatedSchool dataset={stateSchoolReport} filename={`ReporteGraduadosTituladosPlantel_${f}_${h}`} loading={loading} />
        </Col>
        <ReportSchoolTable dataset={stateSchoolReport} onClickPlantel={onClickPlantel}/>
        <br/>
        <br/>
        <br/>
        <h5>Reporte por carrera</h5>
        <br/>
        <br/>
        <br/>
        <Col {...colProps}>
            <ButtonExcelReportGraduatedSchoolCareer dataset={stateSchoolCareerReport} filename={`ReporteGraduadosTituladosCarrera_${f}_${h}`} loading={loading} />
        </Col>
        <ReportCareerTable dataset={stateSchoolCareerReport}/>
      </Loading>
    </>
  );
}
