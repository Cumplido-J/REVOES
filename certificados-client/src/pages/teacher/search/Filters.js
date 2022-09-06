import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTeachersList } from "../../../reducers/teachers/actions/setTeachers";
import { Form, Row, Col, Input, Button } from "antd";
import {
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import Alerts from "../../../shared/alerts";
import { getFilteredTeachers } from "../../../service/TeacherService";
import Catalogs from "../../../service/CatalogService";
import { SearchOutlined } from "@ant-design/icons";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import { PermissionValidatorFn } from "../../../shared/functions";

const { getStateCatalogs, getSchoolCatalogs } = Catalogs;

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
  /* input: [{ required: true, message: "¡El campo es requerido!" }], */
  stateId: [{ required: false, message: "¡El campo es requerido!" }],
  plantel_id: [{ required: false, message: "¡El campo es requerido!" }],
};

export default () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [states, setStates] = useState([]);
  const [statesSelect, setStatesSelect] = useState([]);
  const [schools, setSchools] = useState([]);
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);

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
    setLoading(false);
  };
  useEffect(() => {
    setUp();
  }, []);

  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    setStatesSelect(stateId);
    const schoolsCatalog = await getSchoolCatalogs(stateId);
    if (schoolsCatalog) {
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

  const handleFinish = async (values) => {
    setLoading(true);
    let sendData = {
      input: values.input,
      plantel_id: values.plantel_id,
      estado_id: values.stateId,
    };
    const teachersItems = await getFilteredTeachers(sendData);
    if (
      teachersItems.teachers &&
      teachersItems.teachers.length > 0 &&
      (teachersItems.teachers != null || teachersItems.teachers !== undefined)
    ) {
      dispatch(setTeachersList(teachersItems.teachers));
      let countData = teachersItems.teachers.length;
      Alerts.success(
        "Busqueda",
        `Resultado: ${countData} ${
          countData === 1 ? "registro encotrado" : "registros encotrados"
        }`
      );
    } else {
      Alerts.warning("Busqueda", "No se encontraron resultados");
      dispatch(setTeachersList([]));
    }
    setLoading(false);
  };

  const handleOnClearPlantel = () => {
    setStatesSelect(null);
    setSchools([]);
    form.setFieldsValue({ stateId: null, plantel_id: null, input: null });
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
          <Col {...styles.colProps}>
            <Form.Item
              label="Nombre/CURP empleado"
              name="input"
              rules={validations.input}
            >
              <Input autoComplete="off" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <PermissionValidator
            permissions={[permissionList.NACIONAL, permissionList.ESTATAL]}
            allPermissions={false}
          >
            <Col {...styles.colProps}>
              <Form.Item
                label="Estado"
                name="stateId"
                rules={validations.stateId}
              >
                <SearchSelect
                  dataset={states}
                  value={statesSelect}
                  onChange={handleOnStateChange}
                />
              </Form.Item>
            </Col>
          </PermissionValidator>
          <Col {...styles.colProps}>
            <Form.Item
              label="Plantel"
              name="plantel_id"
              rules={validations.plantel_id}
            >
              <SearchSelect dataset={schools} disabled={!schools.length} />
            </Form.Item>
            <Button type="primary" danger onClick={handleOnClearPlantel}>
              Limpiar filtros
            </Button>
          </Col>
          <Col {...styles.colProps}></Col>
        </Row>
        <Row {...styles.rowProps}>
          <Col {...styles.colProps}>
            <PrimaryButton loading={loading} icon={<SearchOutlined />}>
              Buscar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
};
