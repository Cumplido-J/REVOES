import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGroupsList } from "../../../reducers/groups/actions/setGroups";
import { Form, Row, Col } from "antd";
import {
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import Alerts from "../../../shared/alerts";
import CatalogService from "../../../service/CatalogService";
import { getFilteredGroups } from "../../../service/GroupsService";
import { SearchOutlined } from "@ant-design/icons";
import { PermissionValidatorFn } from "../../../shared/functions";
import { permissionList } from "../../../shared/constants";
import PermissionValidator from "../../../components/PermissionValidator";

const {
  getStateCatalogs,
  getSchoolCatalogs,
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
  const dispatch = useDispatch();
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    async function setUp() {
      let statesCatalog;
      if (PermissionValidatorFn([permissionList.NACIONAL])) {
        statesCatalog = await getStateCatalogs();
        if (statesCatalog && statesCatalog.success) {
          setStates(
            statesCatalog.states.map(({ id, description1 }) => ({
              id,
              description: description1,
            }))
          );
        }
      } else if (PermissionValidatorFn([permissionList.ESTATAL])) {
        statesCatalog = userStates;
        setStates(statesCatalog);
      } else if (PermissionValidatorFn([permissionList.PLANTEL])) {
        setSchools(userSchools);
      }
      setLoading(false);
    }
    setUp();
  }, []);

  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    const schoolsCatalog = await getSchoolCatalogs(stateId);
    if (schoolsCatalog) {
      form.setFieldsValue({ plantel_id: null, carrera_id: null }); // Evita que el bug del find de searchSelect detenga la ejecución
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

  const handleFinish = async (values) => {
    setLoading(true);
    const groupsItems = await getFilteredGroups(values);
    if (groupsItems.success) {
      dispatch(setGroupsList(groupsItems.groups, values.periodo_id)); //Update groups
      if (!groupsItems.groups.length)
        Alerts.warning(
          "No se encontraron registros",
          "No se logro encontrar ningún registro con esos criterios de busqueda."
        );
      setLoading(false);
    }
  };

  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

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
            <Form.Item label="Semestre" name="semestre">
              <SearchSelect
                dataset={Array.from(Array(6).keys()).map((e) => ({
                  id: e + 1,
                  description: e + 1,
                }))}
              />
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
