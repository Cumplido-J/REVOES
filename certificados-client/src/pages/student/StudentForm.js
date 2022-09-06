import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input, DatePicker, Switch } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { validateCurp, validateCurpExtranjero } from "../../shared/functions";
import { ButtonCustomLink, Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import { generationCatalog, studentStatusCatalog } from "../../shared/catalogs";
import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  curp: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurp(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP correcta!");
      },
    },
  ],
  curpExtranjero: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurpExtranjero(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP extranjera correcta!");
      },
    },
  ],
  name: [{ required: true, message: "¡El nombre es requerido!" }],
  firstLastName: [{ required: true, message: "¡El apellido paterno es requerido!" }],
  email: [{ required: true, message: "¡El email es requerido!", type: "email" }],
  enrollmentKey: [{ required: true, message: "¡La matrícula es requerida!" }],
  stateId: [{ required: true, message: "¡El estado es requerido!" }],
  schoolId: [{ required: true, message: "¡El plantel es requerido!" }],
  careerId: [{ required: true, message: "¡La carrera es requerida!" }],
  studentStatusId: [{ required: true, message: "¡El estatus del alumno es requerido!" }],
  generation: [{ required: true, message: "¡La generación es requerida!" }],
  enrollmentStartDate: [{ required: true, message: "¡La fecha de ingreso es requerida!" }],
  enrollmentEndDate: [{ required: true, message: "¡La fecha de egreso es requerida!" }],
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
export default function StudentForm({ studentData, onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState({ states: [], schools: [], careers: [] });
  const [toggleEdit, setToggleEdit] = useState(false);
  const [cycle, setCycle]= useState([]);

  async function onChangeState(stateId) {
    const schools = await getSchools(stateId);
    form.setFieldsValue({ schoolId: null, careerId: null });
    setCatalogs({ ...catalogs, schools, careers: [] });
  }

  async function onChangeSchool(schoolId) {
    const careers = await getCareers(schoolId);
    form.setFieldsValue({ careerId: null });
    setCatalogs({ ...catalogs, careers });
  }

  const cycleState = async () => {
    const {cycle} = await CatalogService.getSchoolCycle();
    const cy = cycle.map(ciclo => ({ id: ciclo.description1, description: ciclo.description1  }) )
    setCycle(cy);
}

  useEffect(() => {
    async function loadStates() {
      const states = await getStates();
      setCatalogs({ states, schools: [], careers: [] });
    }

    const getCycle = async () => {
      await cycleState();
    }
    loadStates();
    getCycle();
  }, []);

  useEffect(() => {
    if (!studentData) return;
    async function loadSchoolsAndCareers() {
      setLoading(true);
      const [states, schools, careers] = await Promise.all([
        getStates(),
        getSchools(studentData.stateId),
        getCareers(studentData.schoolId),
      ]);
      setCatalogs({ states, schools, careers });
      form.setFieldsValue({ ...studentData });
      setToggleEdit(studentData.curp.length > 10 ? false : true)
      setLoading(false);
    }
    loadSchoolsAndCareers();
  }, [studentData, form]);

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
        <Col >
          <Form.Item label="El alumno es extranjero :">
            <Switch
              checkedChildren="Si"
              unCheckedChildren="No"
              onChange={() => { setToggleEdit(!toggleEdit) }}
              checked={toggleEdit}
            />
          </Form.Item>
        </Col>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="CURP:" name="curp" rules={!toggleEdit ? validations.curp : validations.curpExtranjero}>
              <Input placeholder="CURP" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Nombre:" name="name" rules={validations.name}>
              <Input placeholder="Nombre" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Primer Apellido:" name="firstLastName" rules={validations.firstLastName}>
              <Input placeholder="Apellido paterno" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Segundo Apellido:" name="secondLastName">
              <Input placeholder="Apellido materno" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Email:" name="email" rules={validations.email}>
              <Input placeholder="Email" type="email" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Matrícula:" name="enrollmentKey" rules={validations.enrollmentKey}>
              <Input placeholder="Matrícula" style={{ width: "90%" }} />
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
            <Form.Item label="Plantel:" name="schoolId" rules={validations.schoolId}>
              <SearchSelect dataset={catalogs.schools} onChange={onChangeSchool} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Carrera:" name="careerId" rules={validations.careerId}>
              <SearchSelect dataset={catalogs.careers} />
            </Form.Item>
          </Col>
        </Row>

        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Estatus alumno:" name="studentStatusId" rules={validations.studentStatusId}>
              <SearchSelect dataset={studentStatusCatalog} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Generacion:" name="generation" rules={validations.generation}>
              <SearchSelect dataset={cycle} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Fecha de ingreso:" name="enrollmentStartDate" rules={validations.enrollmentStartDate}>
              {/*<DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />*/}
              <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Fecha de egreso:" name="enrollmentEndDate" rules={validations.enrollmentEndDate}>
              {/*<DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />*/}
              <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <ButtonCustomLink link="/Alumnos/" size="large" icon={<ArrowLeftOutlined />} color="red">
              Regresar a lista de alumnos
            </ButtonCustomLink>
          </Col>
          <Col {...colProps}>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Guardar alumno
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}
