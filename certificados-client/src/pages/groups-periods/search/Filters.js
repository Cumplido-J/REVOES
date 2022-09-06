import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGroupsPeriod } from "../../../reducers/groups-periods/actions/setGroupsPeriods";
import {
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import { Form, Row, Col } from "antd";
import CatalogService from "../../../service/CatalogService";
import {
  getSemesterByPeriod,
  PermissionValidatorFn,
} from "../../../shared/functions";
import { SearchOutlined } from "@ant-design/icons";
import Alerts from "../../../shared/alerts";
import { getGroupsPeriod } from "../../../service/GroupsPeriodService";
import { permissionList } from "../../../shared/constants";
import PermissionValidator from "../../../components/PermissionValidator";

const {
  getStateCatalogs,
  getSchoolCatalogs,
  getPeriodsCatalog,
  getCareerCatalogs,
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
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [careers, setCareers] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);

  const handleFinish = async (values) => {
    setLoading(true);
    const groupsItems = await getGroupsPeriod(values);
    if (groupsItems && groupsItems.success) {
      dispatch(setGroupsPeriod(groupsItems.groups));
      if (!groupsItems.groups.length)
        Alerts.warning(
          "No se encontraron registros",
          "No se logro encontrar ningún registro con esos criterios de busqueda."
        );
    }
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  const handleOnPeriodsChange = async (periodId) => {
    setLoading(true);
    form.setFieldsValue({ semestre: null });
    if (periodId) {
      const currentPeriod = periods.filter((p) => p.id === periodId)[0].name;
      setSemesters(
        getSemesterByPeriod(parseInt(currentPeriod.split("").pop()))
      );
    } else {
      setSemesters([]);
    }
    setLoading(false);
  };

  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    const schoolsCatalog = await getSchoolCatalogs(stateId);
    if (schoolsCatalog && schoolsCatalog.success) {
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

  useEffect(() => {
    async function setUp() {
      const periodsCatalog = await getPeriodsCatalog();
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
      if (periodsCatalog && periodsCatalog.success && statesCatalog) {
        setPeriods(
          periodsCatalog.periods.map(({ id, nombre_con_mes, nombre }) => ({
            id,
            description: nombre_con_mes,
            name: nombre,
          }))
        );
        setStates(statesCatalog);
      }
      setLoading(false);
    }
    setUp();
  }, []);

  return (
    <Loading loading={loading}>
      <Form
        form={form}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
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
            <Form.Item label="Carrera" name="carrera_id">
              <SearchSelect dataset={careers} disabled={!careers.length} />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Periodo"
              name="periodo_id"
              rules={validations.required}
            >
              <SearchSelect
                dataset={periods}
                onChange={handleOnPeriodsChange}
              />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Semestre" name="semestre">
              <SearchSelect dataset={semesters} disabled={!semesters.length} />
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
