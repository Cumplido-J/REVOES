import React, { useEffect, useState } from "react";
import { Alert, Form, Row, Col, InputNumber, Input } from "antd";
import { CheckCircleOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

import Alerts from "../../shared/alerts";
import { ButtonCustom, PageLoading, Loading, SearchSelect, PrimaryButton } from "../../shared/components";

import StudentService from "../../service/StudentService";
import CatalogService from "../../service/CatalogService";

const colProps = {
  xs: { span: 24 },
  md: { span: 12 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

export default function StudentModules({ curp, editStudentModules }) {
  const [loading, setLoading] = useState(true);
  const [studentModules, setStudentModules] = useState([]);
  useEffect(() => {
    const getStudentModules = async () => {
      setLoading(true);
      const response = await StudentService.getStudentModules(curp);
      setLoading(false);
      setStudentModules(response.studentModules);
    };
    getStudentModules();
  }, [curp]);
  return (
    <PageLoading loading={loading}>
      <Alert
        style={{ marginBottom: "2em" }}
        message={<strong>ATENCIÓN.</strong>}
        description="Esta sección es exclusiva para la captura de información para certificados de término."
        type="info"
        showIcon
      />
      <Alert
        style={{ marginBottom: "2em" }}
        message={<strong>ATENCIÓN.</strong>}
        description={
          <p>
            Al asignar las competencias del alumno desde aquí, aseguras que el certificado del alumno salga como{" "}
            <strong>bachillerato tecnológico.</strong>
          </p>
        }
        type="warning"
        showIcon
      />
      <StudentModulesForm studentModules={studentModules} editStudentModules={editStudentModules} />
    </PageLoading>
  );
}

function StudentModulesForm({ studentModules, editStudentModules }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [catalogs, setCatalogs] = useState({ careers: [], modules: [] });
  const [careerId, setCareerId] = useState(0);
  const [moduleId, setModuleId] = useState(0);

  useEffect(() => {
    form.setFieldsValue({ modules: studentModules });
  }, [studentModules, form]);

  useEffect(() => {
    const getCareers = async () => {
      setLoading(true);
      let response = await CatalogService.getAllCareersCatalogs();
      setLoading(false);
      if (!response.success) return;

      const careers = response.careers.map((career) => ({
        id: career.id,
        description: `${career.description1} - ${career.description2}`,
      }));
      setCatalogs({ careers, modules: [] });
      return response.careers;
    };
    getCareers();
  }, []);

  const changeCareerId = async (careerId) => {
    setModuleId(null);
    setCareerId(careerId);
    if (!careerId) {
      setCatalogs({ ...catalogs, modules: [] });
      return;
    }
    setLoading(true);
    let response = await CatalogService.getModulesByCareer(careerId);
    setLoading(false);
    if (!response.success) return;
    const modules = response.modules.map((module) => ({
      id: module.id,
      description: `${module.description1}`,
    }));
    setCatalogs({ ...catalogs, modules });
  };

  const addModule = (add) => {
    const career = catalogs.careers.find((career) => career.id === careerId);
    const module = catalogs.modules.find((module) => module.id === moduleId);
    if (!module) {
      Alerts.error("Error", "Favor de seleccionar una competencia");
      return;
    }
    add({ careerName: career.description, id: moduleId, moduleName: module.description, score: null });
  };

  const onFinish = async (values) => {
    setLoading(true);
    await editStudentModules(values);
    setLoading(false);
  };
  return (
    <Loading loading={loading}>
      <Row {...rowProps}>
        <Col {...colProps}>
          <label>Selecciona la carrera</label>
          <SearchSelect dataset={catalogs.careers} value={careerId} onChange={changeCareerId} />
        </Col>
        <Col {...colProps}>
          <label>Selecciona el módulo</label>
          <SearchSelect dataset={catalogs.modules} value={moduleId} onChange={setModuleId} />
        </Col>
      </Row>

      <Form form={form} onFinish={onFinish}>
        <Form.List name="modules">
          {(fields, { add, remove }) => {
            return (
              <>
                <Row {...rowProps}>
                  <Col xs={{ span: 24 }}>
                    <Form.Item>
                      <ButtonCustom
                        fullWidth={true}
                        color="volcano"
                        icon={<PlusOutlined />}
                        onClick={() => addModule(add)}
                      >
                        Agregar competencia
                      </ButtonCustom>
                    </Form.Item>
                  </Col>
                </Row>
                <table className="table table-responsive table-striped">
                  <thead>
                    <tr>
                      <th className="text-center" width="400px">
                        Carrera
                      </th>
                      <th className="text-center">Competencia</th>
                      <th className="text-center" width="150px">
                        Calificacion
                      </th>
                      <th className="text-center" width="150px">
                        Eliminar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={index}>
                        <td className="text-center">
                          <Form.Item name={[field.name, "careerName"]} fieldKey={[field.fieldKey, "careerName"]}>
                            <Input disabled />
                          </Form.Item>
                        </td>
                        <td className="text-center">
                          <Form.Item name={[field.name, "moduleName"]} fieldKey={[field.fieldKey, "moduleName"]}>
                            <Input disabled />
                          </Form.Item>
                        </td>
                        <td className="text-center">
                          <Form.Item
                            name={[field.name, "score"]}
                            fieldKey={[field.fieldKey, "score"]}
                            rules={[{ required: true, message: "La calificacion es requerida" }]}
                          >
                            <InputNumber max={10} min={6} />
                          </Form.Item>
                        </td>
                        <td className="text-center">
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            style={{ margin: "0 8px" }}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Row {...rowProps}>
                  <Col xs={{ span: 24 }}>
                    <Form.Item>
                      <PrimaryButton
                        disabled={fields.length === 0}
                        fullWidth={true}
                        color="volcano"
                        icon={<CheckCircleOutlined />}
                      >
                        Guardar módulos
                      </PrimaryButton>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            );
          }}
        </Form.List>
      </Form>
    </Loading>
  );
}
