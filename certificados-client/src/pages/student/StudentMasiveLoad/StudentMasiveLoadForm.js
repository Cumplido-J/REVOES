import React, { useEffect, useState } from "react";

import { Form, Row, Col } from "antd";

import { Loading, SearchSelect } from "../../../shared/components";
import Alerts from "../../../shared/alerts";

import CatalogService from "../../../service/CatalogService";
import ExcelLoad from "./GetDataFromExcelJusTInput";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {

  stateId: [{ required: true, message: "¡El estado es requerido!" }],
  schoolId: [{ required: true, message: "¡El plantel es requerido!" }],
  careerId: [{ required: true, message: "¡La carrera es requerida!" }],
  generationId: [{ required: true, message: "¡La generación es requerida!" }],
};

async function getStates() {
  const response = await CatalogService.getStateCatalogs();
  return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}
async function getSchools(stateId) {
  const response = await CatalogService.getSchoolCatalogs(stateId);
  return response.schools.map((school) => ({
    id: school.id,
    description: `${school.description1} - ${school.description2}`,
  }));
}

async function getCareers(schoolId) {
  const response = await CatalogService.getCareerCatalogs(schoolId);
  return response.careers.map((career) => ({
    id: career.id,
    description: `${career.description1} - ${career.description2}`,
  }));
}

async function getGenerations() {
  const response = await CatalogService.getGenerationsCatalogs();
  return response.generations.map((generation) => ({
    id: generation.id,
    description: generation.description
  }));
}

async function getPeriodos(stateId, generation) {
  const response = await CatalogService.selectPeriodFinished(stateId, generation);
  return response;
}
/////////////////////////////////////

export default function StudentMasiveLoadForm({ masiveLoadData, onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState({ states: [], schools: [], careers: [], generations: [] });
  const [estate, setEstate] = useState({
    hoja: "",
    hojas: [],
    file: false,
    disabled: true,
    studentData: ""
  });
  /////////////para carga masiva definimos estado
  const [idCarrera, setIdCarrera] = useState(0);
  const [idGeneration, setIdGeneration] = useState("");
  const [idEntidad, setIdEntidad] = useState("");
  const [hiddenExcel, setHiddenExcel] = useState(true);
  const [fecha, setFecha] = useState(null);

  const [stateId, setStateId] = useState();
  const [generation, setGeneration] = useState();
  const [period, setPeriod] = useState([]);
  //mandamos a llamar para actualizar
  const upDateIdCarrera = (id) => {
    setIdCarrera(id)
  }

  const upDateIdGeneration = (id) => {
    setIdGeneration(id)
  }

  const upDateIdEntidad = (id) => {
    setIdEntidad(id)
  }


  async function onChangeState(stateId) {
    if (stateId != null) setStateId(stateId);
    const schools = await getSchools(stateId);
    upDateIdEntidad(stateId);
    form.setFieldsValue({ schoolId: null, careerId: null, generationId: null });
    setCatalogs({ ...catalogs, schools, careers: [], generations: [] });
    setHiddenExcel(true);
    setEstate({
      hoja: "",
      hojas: [],
      file: false,
      disabled: true,
      studentData: ""
    });
  }

  async function onChangeSchool(schoolId) {
    const careers = await getCareers(schoolId);
    form.setFieldsValue({ careerId: null, generationId: null });
    setCatalogs({ ...catalogs, careers, generations: [] });
    setHiddenExcel(true);
    setEstate({
      hoja: "",
      hojas: [],
      file: false,
      disabled: true,
      studentData: ""
    });
  }



  ///para masiveload cuando cambia el id lo actualizamos
  async function onChangeCareer(careerId) {

    console.log(`careerId careerId= ${careerId} hiddenExcel=${hiddenExcel}`);
    const generations = await getGenerations();
    form.setFieldsValue({ generationId: null });
    upDateIdCarrera(careerId);
    setCatalogs({ ...catalogs, generations });
    setHiddenExcel(true);
    setEstate({
      hoja: "",
      hojas: [],
      file: false,
      disabled: true,
      studentData: ""
    });
  }

  async function onChangeGenerations(generationId) {
    if (generationId == "" || generationId == null) {
      setHiddenExcel(true);
    } else {
      setGeneration(generationId);
      upDateIdGeneration(generationId);
      setHiddenExcel(false);
    }
    console.log(`generationId generationId= ${generationId} hiddenExcel=${hiddenExcel}`);
    setEstate({
      hoja: "",
      hojas: [],
      file: false,
      disabled: true,
      studentData: "",
      generation: generationId
    });
    console.log("id de generation:" + estate.generation);
  }

  const onChangePeriod = (id) =>{
    setFecha(id);
  }



  useEffect(() => {
    async function loadStates() {
      const states = await getStates();
      setCatalogs({ states, schools: [], careers: [], periods: [], generations: [] });
    }
    loadStates();
  }, []);

  const handleFinish = async (values) => {
    setLoading(true);
    //await onSubmit(values);
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  useEffect(() => {
    async function getPeriod() {
      if (stateId != null && generation != null) {
        const response = await getPeriodos(stateId, generation);//CatalogService.selectPeriodFinished(stateId, generation);
        if (!response.success) return;
        const lista = response.fecha.map((p) => ({
          id: p.description1,
          description: `F${p.id}-${p.description1}`
        }));
        setPeriod(lista);

      }
    }
    getPeriod();

  }, [stateId, generation])

  return (
    <Loading loading={loading}>
      <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
        <Row>
          <Col {...colProps}>
            <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
              <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Plantel:" name="schoolId" rules={validations.schoolId}>
              <SearchSelect dataset={catalogs.schools} onChange={onChangeSchool} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Carrera:" name="careerId" rules={validations.careerId}>
              <SearchSelect dataset={catalogs.careers} onChange={onChangeCareer} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col {...colProps}>
            <Form.Item label="Generación:" name="generationId" rules={validations.generationId}>
              <SearchSelect dataset={catalogs.generations} onChange={onChangeGenerations} />
            </Form.Item>
          </Col>
          {period.length > 0 && (
            <Col {...colProps}>
              <Form.Item label="Fecha de certificación:" name="periodo" rules={validations.generationId}>
                <SearchSelect dataset={period} onChange={onChangePeriod} />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row>
          <Col {...colProps}>
            <div hidden={hiddenExcel}>
              <Form.Item label="Carga tu excel" name="masiveLoadId" >
                <ExcelLoad idEntidad={idEntidad} idCarrera={idCarrera} idGeneration={idGeneration} catalogsCareer={catalogs.careers} state={estate} fecha={fecha} />
              </Form.Item>
            </div>
          </Col>
        </Row>

      </Form>
    </Loading>
  );
}

