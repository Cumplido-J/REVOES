import React, { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  Loading,
  SearchSelect,
  PrimaryButton,
} from "../../../shared/components";
import { Form, Row, Col, Input } from "antd";
import alerts from "../../../shared/alerts";
import CatalogService from "../../../service/CatalogService";
import StudentService from "../../../service/StudentService";
import { PermissionValidatorFn } from "../../../shared/functions";
import { permissionList } from "../../../shared/constants";
import { useSelector, useDispatch } from "react-redux";
import PermissionValidator from "../../../components/PermissionValidator";
import { setStudentsSearchTable } from "../../../reducers/studentsReducer/actions/setStudentsSearchTable";
import { estatusInscripcionEnums } from "../../../shared/catalogs";
import { getGroupsPeriod } from "../../../service/GroupsPeriodService";

const { getStateCatalogs, getSchoolCatalogs, getCareerCatalogs } =
  CatalogService;

const { getStudentsBySchoolCareerSemester } = StudentService;

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

export default () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [careers, setCareers] = useState([]);
  const [groupsPeriod, setGroupsPeriod] = useState([]);
  const currentPeriod = useSelector((state) => state.permissionsReducer.period);
  const [form] = Form.useForm();
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);

  useEffect(() => {
    const setUp = async () => {
      let statesCatalog;
      if (PermissionValidatorFn([permissionList.NACIONAL])) {
        statesCatalog = await getStateCatalogs();
        if (statesCatalog && statesCatalog.success) {
          statesCatalog = statesCatalog.states.map(({ id, description1 }) => ({
            id,
            description: description1,
          }));
        }
      } else if (PermissionValidatorFn([permissionList.ESTATAL])) {
        statesCatalog = userStates;
      } else if (PermissionValidatorFn([permissionList.PLANTEL])) {
        statesCatalog = [];
        setSchools(userSchools);
      }
      if (statesCatalog) {
        setStates(statesCatalog);
      }
      form.setFieldsValue({ estatus_inscripcion: "Activo" });
      setLoading(false);
    };
    setUp();
  }, []);

  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    const schoolCatalog = await getSchoolCatalogs(stateId);
    if (schoolCatalog && schoolCatalog.success) {
      form.setFieldsValue({
        plantel_id: null,
        carrera_id: null,
      });
      setSchools(
        schoolCatalog.schools.map(({ id, description1, description2 }) => ({
          id,
          description: `${description1} - ${description2}`,
        }))
      );
      setCareers([]);
    }
    setLoading(false);
  };

  const handleOnSchoolChange = async (schoolId) => {
    setLoading(true);
    const careerCatalog = await getCareerCatalogs(schoolId);
    if (careerCatalog && careerCatalog.success) {
      form.setFieldsValue({
        carrera_id: null,
      });
      setCareers(
        careerCatalog.careers.map(({ id, description1, description2 }) => ({
          id,
          description: `${description1} - ${description2}`,
        }))
      );
    }
    setLoading(false);
    await loadGroupsPeriod();
  };

  const handleOnCareerChange = async (careerId) => {
    await loadGroupsPeriod();
  };

  const loadGroupsPeriod = async () => {
    setLoading(true);
    const schoolId = form.getFieldValue("plantel_id");
    const careerId = form.getFieldValue("carrera_id");
    if (schoolId) {
      const params = {
        plantel_id: schoolId,
        periodo_id: currentPeriod.id,
      };
      if (careerId) params.carrera_id = careerId;
      const groupsPeriodResult = await getGroupsPeriod(params);
      if (groupsPeriodResult && groupsPeriodResult.success) {
        setGroupsPeriod(
          groupsPeriodResult.groups.map(({ id, semestre, grupo }) => ({
            id,
            description: `${semestre} ${grupo}`,
          }))
        );
      } else {
        setGroupsPeriod([]);
      }
    } else {
      form.setFieldsValue({ grupo_periodo_id: null });
      setGroupsPeriod([]);
    }
    setLoading(false);
  };

  const handleOnFinish = async (values) => {
    setLoading(true);
    if (values.regularidad === "regular") {
      values.solo_regulares = true;
      values.solo_irregulares = false;
    } else if (values.regularidad === "irregular") {
      values.solo_irregulares = true;
      values.solo_regulares = false;
    } else {
      values.solo_irregulares = false;
      values.solo_regulares = false;
    }
    values.inscripcion_grupo = true;
    const apiSearch = await getStudentsBySchoolCareerSemester(values);
    if (apiSearch && apiSearch.success) {
      dispatch(setStudentsSearchTable(apiSearch.data));
      if (!apiSearch?.data?.length) {
        alerts.warning(
          "No se encontraron registros",
          "No se logro encontrar ningún registro con esos criterios de busqueda."
        );
      }
    }
    setLoading(false);
  };

  const handleOnFinishFailed = () => {
    alerts.error(
      "Favor de llenar correctamente",
      "Existen campos incompletos o incorrectos."
    );
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
                onChange={handleOnSchoolChange}
                disabled={!schools.length}
              ></SearchSelect>
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Carrera" name="carrera_id">
              <SearchSelect
                dataset={careers}
                onChange={handleOnCareerChange}
                disabled={!careers.length}
              ></SearchSelect>
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Grupo" name="grupo_periodo_id">
              <SearchSelect
                dataset={groupsPeriod}
                disabled={!groupsPeriod.length}
              ></SearchSelect>
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Semestre" name="semestre">
              <SearchSelect
                dataset={Array.from(Array(6).keys()).map((e) => ({
                  id: e + 1,
                  description: e + 1,
                }))}
              ></SearchSelect>
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Regular o irregular" name="regularidad">
              <SearchSelect
                dataset={[
                  { id: "regular", description: "Sólo alumnos regulares" },
                  { id: "irregular", description: "Sólo alumnos irregulares" },
                ]}
              ></SearchSelect>
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Estatus de inscripción"
              name="estatus_inscripcion"
            >
              <SearchSelect
                dataset={estatusInscripcionEnums.map((estatus) => ({
                  id: estatus,
                  description: estatus,
                }))}
              ></SearchSelect>
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Nombre/CURP/Matrícula" name="cadena">
              <Input
                placeholder="Nombre/CURP/Matrícula"
                style={{ width: "90%" }}
              />
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
