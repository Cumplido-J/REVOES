import { Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import PermissionValidator from "../../../components/PermissionValidator";
import useSchoolCatalog from "../../../hooks/catalogs/useSchoolCatalog";
import useStatesCatalog from "../../../hooks/catalogs/useStatesCatalog";
import {
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import { permissionList } from "../../../shared/constants";
import { SearchOutlined } from "@ant-design/icons";
import StudentService from "../../../service/StudentService";

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};

const validations = {
  required: [
    {
      required: true,
      message: "Este campo es requerido",
    },
  ],
};

const Filters = ({ onSearch, setStateSelected }) => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [statesLoading, states] = useStatesCatalog();
  const [schoolsLoading, schools, setSchoolStateFilter] = useSchoolCatalog();

  useEffect(() => {
    setLoading(statesLoading && schoolsLoading);
  }, [statesLoading, schoolsLoading]);

  const handleOnStateChange = (id) => {
    setLoading(true);
    setSchoolStateFilter(id);
  };

  const parseListData = (studentsToGraduate) =>
    studentsToGraduate.map((student) => ({
      matricula: student?.matricula,
      nombre: student?.usuario?.nombre,
      lastname1: student?.usuario?.primer_apellido,
      lastname2: student?.usuario?.segundo_apellido,
      curp: student?.usuario?.username,
      semester: student?.semestre,
      career: `${student?.carrera?.clave_carrera} - ${student?.carrera?.nombre}`,
      tipo_alumno: student?.tipo_alumno,
      tipo_trayectoria: student?.tipo_trayectoria,
      estatus_inscripcion: student?.estatus_inscripcion,
      usuario_id: student?.usuario_id,
      selected: false,
      modules: student?.modulos.map((module) => ({
        grade: module[0]?.calificacion,
        key: module[0]?.carrera_uac?.uac?.clave_uac,
        name: module[0]?.carrera_uac?.uac?.nombre,
        semester: module[0]?.carrera_uac?.uac?.semestre,
        id: module[0]?.id,
        type:
          module[0]?.carrera_uac?.uac?.tipo_uac_id === 3 ||
          module[0]?.carrera_uac?.uac?.tipo_uac_id === 4
            ? "Módulo"
            : "Submódulo",
      })),
      generacion: student?.generacion,
      periodo_inicio: student?.periodo_inicio,
      periodo_termino: student?.periodo_termino,
    }));

  const handleOnFinish = async ({ state_id, plantel_id }) => {
    setLoading(true);
    const studentsToGraduateResponse =
      await StudentService.getStudentsToGraduateBySchool(plantel_id);
    if (studentsToGraduateResponse && studentsToGraduateResponse.success) {
      onSearch(parseListData(studentsToGraduateResponse.data));
      setStateSelected(state_id);
    }
    setLoading(false);
  };

  const handleOnFinishFailed = (error) => {
    console.log(error);
  };

  return (
    <Loading loading={loading}>
      <Form
        form={form}
        onFinish={handleOnFinish}
        onFinishFailed={handleOnFinishFailed}
        layout="vertical"
      >
        <Row {...styles.rowProps}>
          <PermissionValidator
            permissions={[permissionList.NACIONAL, permissionList.ESTATAL]}
            allPermissions={false}
          >
            <Col {...styles.colProps}>
              <Form.Item
                label="Estado"
                name="state_id"
                rules={validations.required}
              >
                <SearchSelect
                  dataset={states}
                  onChange={handleOnStateChange}
                ></SearchSelect>
              </Form.Item>
            </Col>
          </PermissionValidator>
          <Col {...styles.colProps}>
            <Form.Item
              label="Plantel"
              name="plantel_id"
              rules={validations.required}
            >
              <SearchSelect
                dataset={schools}
                disabled={!schools.length}
              ></SearchSelect>
            </Form.Item>
          </Col>
        </Row>
        <Row {...styles.rowProps}>
          <PrimaryButton loading={loading} icon={<SearchOutlined />}>
            Buscar
          </PrimaryButton>
        </Row>
      </Form>
    </Loading>
  );
};

export default Filters;
