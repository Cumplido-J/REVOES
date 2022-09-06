import React, { useEffect, useState } from "react";

import { Form, Row, Col, Select } from "antd";


import { Loading, ButtonExcelMasiveLoadGraduates, ButtonExcelGraduationXlsx, SearchSelect } from "../../../shared/components";
import Alerts from "../../../shared/alerts";

import CatalogService from "../../../service/CatalogService";
import ExcelLoad from "./GetDataFromExcelJusTInput";
import { ExportExcel } from "./ExportExcel";

const { Option } = Select;

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {

  stateId: [{ required: true, message: "¡El estado es requerido!" }],
  generationId: [{ required: true, message: "¡la generación es requerida!" }],
};

/////////////////////////////////////

export default function StudentMasiveLoadForm({ masiveLoadData, onSubmit }) {
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({ states: [] });
  const [loading, setLoading] = useState(true);

  //definimos los valores de los selects
  const [idEstado, setIdEstado] = useState(0);
  const [idGeneracion, setIdGeneracion] = useState(0);
  //mandamos a llamar para actualizar
  const upDateIdEstado = (id) => {
    setIdEstado(id)
  }
  const upDateIdGeneracion = (id) => {
    setIdGeneracion(id)
  }

  useEffect(() => {
    async function getStates() {
      const response = await CatalogService.getStateCatalogs();
      form.setFieldsValue({ generationId: null });
      if (!response) return;
      const states = response.states.map((state) => ({ id: state.id, description: state.description1 }));

      setCatalogs({ states });
      setLoading(false);
    }
    getStates();
  }, []);

  //para guardar los estados del select de generacion y los botones de descarga y enviar (si estan deshabilitados o no)
  const [noSelect, setNoSelect] = useState({
    selGen: true,
  });

  const onChangeState = (id) => {
    //habilitamos el select generacion y deshabilitamos lo demas
    setNoSelect({ ...noSelect, selGen: false });
    //console.log("en onChangeState:"+id);
    upDateIdEstado(id);
  };

  const onChangeGeneration = (id) => {
    //console.log("en onChangeGeneration:"+id);
    upDateIdGeneracion(id);
  };

  const column = [
    {
      'colegio': '', 'cct': '', 'nombre_plantel': '', 'turno': '', 'cve_carrera': '', 'nombre_carrera': '', 'matricula': '',
      'nombre': '', 'ap_paterno': '', 'ap_materno': '', 'curp': '', 'genero': '', 'correo': '', 'grupo': ''
    },
  ]

  return (
    <Loading loading={loading}>
      <Form form={form} layout="vertical">
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Descarga el formato del csv:">
              <center>
                <ButtonExcelMasiveLoadGraduates filename={`carga_alumnos`} />
              </center>
            </Form.Item>
          </Col>
          {/*<Col {...colProps}>
            <Form.Item label="Descarga el formato del xlsx:">
              <center>
                <ButtonExcelGraduationXlsx filename={`carga_alumnos`} />
              </center>
            </Form.Item>
  </Col>*/}
          <Col {...colProps}>
            <Form.Item label="Descarga el formato de excel:">
              <center>
                <ExportExcel fileName="carga_sexto_semestre" dataSet={column} />
              </center>
            </Form.Item>

          </Col>
        </Row>


        <Row>
          <Col {...colProps}>
            <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
              <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Generación:" name="generationId" rules={validations.generationId} style={{ width: "90%" }}  >
              <Select disabled={noSelect.selGen} onChange={onChangeGeneration}>

                <Option value="2019-2022">2019-2022</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col {...colProps}>
            <div>
              <Form.Item label="Carga tu csv o xlsx" name="masiveLoadId" >
                <ExcelLoad idEstado={idEstado} idGeneracion={idGeneracion} />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}

