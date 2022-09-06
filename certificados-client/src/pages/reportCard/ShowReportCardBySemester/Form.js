import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "antd";
import {
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import { PermissionValidatorFn } from "../../../shared/functions";
import { useSelector } from "react-redux";
import CatalogService from "../../../service/CatalogService";
import alerts from "../../../shared/alerts";
import { Semesters } from "../../../shared/catalogs";
import { SearchOutlined } from "@ant-design/icons";
import { getReportCardBySemester } from "../../../service/ReportCardService";

const {
  getStateCatalogs,
  getSchoolCatalogs,
  getCareerCatalogs,
  getPeriodsCatalog,
} = CatalogService;

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
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // Datasets
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [careers, setCareers] = useState([]);
  const [periods, setPeriods] = useState([]);

  // User data
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);

  // On change
  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    const schoolsCatalog = await getSchoolCatalogs(stateId);
    if (schoolsCatalog) {
      form.setFieldsValue({ plantel_id: null, carrera_id: null });
      setCareers([]);
      setSchools(
        schoolsCatalog.schools.map(({ id, description1, description2 }) => ({
          id,
          description: `${description1} - ${description2}`,
        }))
      );
    }
    setLoading(false);
  };
  const handleOnSchoolChange = async (schoolId) => {
    setLoading(true);
    const careersCatalog = await getCareerCatalogs(schoolId);
    if (careersCatalog) {
      form.setFieldsValue({ carrera_id: null });
      setCareers(
        careersCatalog.careers.map(({ id, description1, description2 }) => ({
          id,
          description: `${description1} - ${description2}`,
        }))
      );
    }
    setLoading(false);
  };

  // On Mounted
  useEffect(() => {
    const setUp = async () => {
      setLoading(true);
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
      const periodsCatalog = await getPeriodsCatalog();
      if (periodsCatalog && periodsCatalog.success && statesCatalog) {
        setPeriods(
          periodsCatalog.periods.map(({ id, nombre_con_mes }) => ({
            id,
            description: nombre_con_mes,
          }))
        );
        setStates(statesCatalog);
      }
      setLoading(false);
    };
    setUp();
  }, []);

  // Submit Handlers
  const handleOnFinish = async (data) => {
    setLoading(true);
    const pdfResponse = await getReportCardBySemester(data);
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };

  const handleOnFinishFailed = () => {
    alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };
  return (
    <Loading loading={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOnFinish}
        onFinishFailed={handleOnFinishFailed}
      >
        <Row {...styles.rowProps}>
          <PermissionValidator
            permissions={[permissionList.NACIONAL, permissionList.ESTATAL]}
            allPermissions={false}
          >
            <Col {...styles.colProps}>
              <Form.Item
                label="Estado"
                name="stateId"
                rules={validations.required}
              >
                <SearchSelect dataset={states} onChange={handleOnStateChange} />
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
                onChange={handleOnSchoolChange}
              />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Carrera"
              name="carrera_id"
              rules={validations.required}
            >
              <SearchSelect dataset={careers} disabled={!careers.length} />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Periodo"
              name="periodo_id"
              rules={validations.required}
            >
              <SearchSelect dataset={periods} />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Semestre"
              name="semestre"
              rules={validations.required}
            >
              <SearchSelect dataset={Semesters} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...styles.rowProps}>
          <Col {...styles.colProps}>
            {/*TODO: Debe cambiar el color del boton busqueda*/}
            <PrimaryButton loading={loading} icon={<SearchOutlined />}>
              Buscar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
};
