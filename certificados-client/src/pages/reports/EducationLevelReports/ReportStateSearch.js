import React, { useEffect, useState } from "react";

import { Form, Row, Col, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Loading,  SearchSelect, ButtonCustom, ButtonExcelReportStudyLevelState, ButtonExcelReportStudyLevelSchool, ButtonExcelReportStudyLevelSchools } from "../../../shared/components";
import Alerts from "../../../shared/alerts";
import ReportsSchoolEnrollmentService from "../../../service/ReportsSchoolEnrollmentService";
import ReportStateTable from "./ReportStateTable";
import ReportSchoolsTable from "./ReportSchoolsTable";
import ReportSchoolTable from "./ReportSchoolTable";

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
  const [stateSchoolsReport, setStateSchoolsReport] = useState([]);

  //para guardar los estados del select de matricula y los intputs de valores (si estan deshabilitados o no)
  const [noSelect, setNoSelect]=useState({
    selCiclo:true,
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
        btnBus:true
      });
      //vaciamos la tabla 1
      setStateReport([]);
      //vaciamos la tabla 2
      setStateSchoolsReport([]);
      //vaciamos la tabla 3
      setStateSchoolReport([]);
      setLoading(false);
    }
    getschoolCycles();
  }, []);

  ///////------------------------------CARGA LOS SELECTS-----------------------------------------------
  ////////////////////////OnCHANGE SELECT ciclo
  const onChangeCycle = () => {
    //habilitamos el select matricula y deshabilitamos lo demas
    setNoSelect({...noSelect,btnBus:false
              });
    //vaciamos la tabla
    setStateReport([]);
    //vaciamos la tabla 2
    setStateSchoolsReport([]);
    //vaciamos la tabla 3
    setStateSchoolReport([]);
  };

  ////////////////////////OnCLICK btnBuscar
  const onClickBuscar = async () => {
    setLoading(true);
    //vaciamos la tabla
    setStateReport([]);
    //vaciamos la tabla 2
    setStateSchoolsReport([]);
    //vaciamos la tabla 3
    setStateSchoolReport([]);

    let cicloId=form.getFieldsValue().cicloId;
  

    //guardamos si encontro datos
    let encontro=false;
    const response = await ReportsSchoolEnrollmentService.getStateEducationLevel(cicloId);
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
      //console.log("reporte por estado");
      //console.log(response.reports);
      Alerts.success("Éxito", "Se encontraron datos");
    }else{
      Alerts.warning("Éxito", "No se encontraron datos");
    }
  };


    ////////////////////////OnCLICK lnkEstado la de schools
    const onClickEstado = async (idEntidad) => {
      setLoading(true);
      //vaciamos la tabla 2
      setStateSchoolsReport([]);
      //vaciamos la tabla 3
      setStateSchoolReport([]);
      let cicloId=form.getFieldsValue().cicloId;
  
      const response = await ReportsSchoolEnrollmentService.getStateSchoolsEducationLevel(cicloId, idEntidad);
      if (!response)
      {
        Alerts.warning("Éxito", "No se encontraron datos");
        return;
      }
      setStateSchoolsReport(response.reports);
      setLoading(false);
      //validamos si encontro algo
      if(response.reports.length>0)
      {
        //console.log(response.reports);
        Alerts.success("Éxito", "Se encontraron datos");
      }else{
        Alerts.warning("Éxito", "No se encontraron datos");
      }
    };

  ////////////////////////OnCLICK plantel
  const onClickPlantel = async (idPlantel) => {
    setLoading(true);
    //vaciamos la tabla 3
    setStateSchoolReport([]);
    let cicloId=form.getFieldsValue().cicloId;

    const response = await ReportsSchoolEnrollmentService.getStateSchoolEducationLevel(cicloId, idPlantel);
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
      //console.log(response.reports);
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

            <ButtonExcelReportStudyLevelState dataset={stateReport} filename={`ReporteNivelEstudiosEstado_${f}_${h}`} loading={loading} />
        </Col>
      </Row>
      <Loading loading={loading} >
        <ReportStateTable dataset={stateReport} onClickEstado={onClickEstado}/>
        <br/>
        <br/>
        <br/>
        <h5>Reporte planteles</h5>
        <br/>
        <br/>
        <br/>
        <Col {...colProps}>
            <ButtonExcelReportStudyLevelSchools dataset={stateSchoolsReport} filename={`ReporteNivelEstudiosPlanteles_${f}_${h}`} loading={loading} />
        </Col>
        <ReportSchoolsTable datasetSchools={stateSchoolsReport} onClickPlantel={onClickPlantel}/>

        <br/>
        <br/>
        <br/>
        <h5>Reporte detalle por plantel</h5>
        <br/>
        <br/>
        <br/>
        <Col {...colProps}>
            <ButtonExcelReportStudyLevelSchool dataset={stateSchoolReport} filename={`ReporteNivelEstudiosPlantel_${f}_${h}`} loading={loading} />
        </Col>
        <ReportSchoolTable datasetSchool={stateSchoolReport}/>
      </Loading>
    </>
  );
}
