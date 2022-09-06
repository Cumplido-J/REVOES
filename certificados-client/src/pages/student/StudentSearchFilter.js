import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Loading, PrimaryButton, SearchSelect } from "../../shared/components";
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
// const validations = {
//   generation: [
//     {
//       required: true,
//       message: "Este campo es requerido",
//     },
//   ],
// };
export default function StudentSearchFilter({ history, userProfile, onSubmit,onSubmitOne }) {
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({ states: [], schools: [], careers: [] });
  const [loading, setLoading] = useState(true);
  const [cycle, setCycle]= useState([]);

  useEffect(() => {
    const getCycle = async () => {
      await cycleState();
    }
    async function getStates() {
      const response = await CatalogService.getStateCatalogs();
      if (!response) return;
      const states = response.states.map((state) => ({ id: state.id, description: state.description1 }));

      setCatalogs({ states, schools: [], careers: [] });
      setLoading(false);
    }

    getStates();
    getCycle();
  }, []);

  const cycleState = async () => {
    const {cycle} = await CatalogService.getSchoolCycle();
    const cy = cycle.map(ciclo => ({ id: ciclo.description1, description: ciclo.description1  }) )
    setCycle(cy);
  }

  const onChangeState = async (stateId) => {
    const response = await CatalogService.getSchoolCatalogs(stateId);
    if (!response) return;

    const schools = response.schools.map((school) => ({
      id: school.id,
      description: `${school.description1} - ${school.description2}`,
    }));
    form.setFieldsValue({ schoolId: null, careerId: null });
    setCatalogs({ ...catalogs, schools, careers: [] });
  };

  const onChangeSchool = async (schoolId) => {
    const response = await CatalogService.getCareerCatalogs(schoolId);
    if (!response) return;
    const careers = response.careers.map((career) => ({
      id: career.id,
      description: `${career.description1} - ${career.description2}`,
    }));
    form.setFieldsValue({ careerId: null });
    setCatalogs({ ...catalogs, careers });
  };

  const handleFinish = async (values) => {
    setLoading(true);
    const campo1=values.stateId;
    const campo2=values.schoolId;
    const campo3=values.careerId;
    const campo4=values.studentStatusId;
    const campo5=values.generation;
    const campo6=values.searchText;
    if (campo1==null && campo2==null && campo3==null &&
        campo4==null && campo5==null && campo6!=null){
          await onSubmitOne(values);
        }else{
          await onSubmit(values);
        }
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
            <Form.Item label="Estado:" name="stateId">
              <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Plantel:" name="schoolId">
              <SearchSelect dataset={catalogs.schools} onChange={onChangeSchool} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Carrera:" name="careerId">
              <SearchSelect dataset={catalogs.careers} />
            </Form.Item>
          </Col>
        </Row>

        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Estatus alumno:" name="studentStatusId">
              <SearchSelect dataset={studentStatusCatalog} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            {/* <Form.Item label="Generacion:" name="generation" rules={validations.generation}> */}
            <Form.Item label="Generacion:" name="generation">
              <SearchSelect dataset={cycle} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Nombre/CURP/Matricula:" name="searchText">
              <Input placeholder="Nombre/CURP/Matricula" allowClear style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <PrimaryButton loading={loading} icon={<SearchOutlined />}>
              Buscar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}
