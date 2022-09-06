import React, { useEffect, useState } from "react";
import { Form, DatePicker, Row, Col } from "antd";
import moment from "moment";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
  Loading,
  SearchSelect,
  PrimaryButton,
} from "../../../shared/components";
import { EnrollmentTypesGroupsConfigCatalog } from "../../../shared/catalogs";
import { setSchoolEnrollmentConfigOnGroup } from "../../../service/GroupsPeriodService";
import Alerts from "../../../shared/alerts";
import CatalogService from "../../../service/CatalogService";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import { PermissionValidatorFn } from "../../../shared/functions";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;

const { getStateCatalogs, getSchoolCatalogs } = CatalogService;

export default () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);

  useEffect(() => {
    async function setUp() {
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
      setLoading(false);
    }
    setUp();
  }, []);

  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    const schoolsCatalog = await getSchoolCatalogs(stateId);
    if (schoolsCatalog && schoolsCatalog.success) {
      form.setFieldsValue({ plantel_id: null });
      setSchools(
        schoolsCatalog.schools.map(({ id, description1, description2 }) => ({
          id,
          description: `${description1} - ${description2}`,
        }))
      );
    }
    setLoading(false);
  };

  const handleFinish = async ({
    irregular,
    regular,
    tipo_inscripcion,
    plantel_id,
  }) => {
    setLoading(true);
    const data = {
      tipo_inscripcion,
      fecha_inicio: moment(regular[0]).format("DD/MM/YYYY"),
      fecha_fin: moment(regular[1]).format("DD/MM/YYYY"),
      fecha_inicio_irregular: moment(irregular[0]).format("DD/MM/YYYY"),
      fecha_fin_irregular: moment(irregular[1]).format("DD/MM/YYYY"),
    };
    const response = await setSchoolEnrollmentConfigOnGroup(plantel_id, data);
    if (response.success) {
      Alerts.success("Listo", "Configuración guardada con éxito");
    }
    setLoading(false);
  };

  const handleFail = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  const validations = {
    req: [{ required: true, message: "Este campo es requerido" }],
  };
  const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
  };
  const rowProps = {
    style: { marginBottom: "1em" },
  };
  return (
    <>
      <Loading loading={loading}>
        <Form
          form={form}
          onFinish={handleFinish}
          onFinishFailed={handleFail}
          layout="vertical"
        >
          <Row {...rowProps}>
            <PermissionValidator
              permissions={[permissionList.NACIONAL, permissionList.ESTATAL]}
              allPermissions={false}
            >
              <Col {...colProps}>
                <Form.Item
                  label="Estado"
                  name="stateId"
                  rules={validations.req}
                >
                  <SearchSelect
                    dataset={states}
                    onChange={handleOnStateChange}
                  />
                </Form.Item>
              </Col>
            </PermissionValidator>
            <Col {...colProps}>
              <Form.Item
                label="Plantel"
                name="plantel_id"
                rules={validations.req}
              >
                <SearchSelect dataset={schools} disabled={!schools.length} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <Form.Item
                label="Fechas para alumno regular"
                name="regular"
                rules={validations.req}
              >
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha de inicio", "Fecha límite"]}
                />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item
                label="Fechas para alumnos irregulares"
                name="irregular"
                rules={validations.req}
              >
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha de inicio", "Fecha límite"]}
                />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item
                label="Tipo de inscripción"
                name="tipo_inscripcion"
                rules={validations.req}
              >
                <SearchSelect dataset={EnrollmentTypesGroupsConfigCatalog} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <PrimaryButton
                icon={<CheckCircleOutlined />}
                size={"large"}
                fullWidth={false}
              >
                Guardar configuración
              </PrimaryButton>
            </Col>
          </Row>
        </Form>
      </Loading>
    </>
  );
};
