import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTeachersList } from "../../../reducers/teachers/actions/setTeachers";
import { getFilteredIntersemestral } from "../../../service/IntersemestralService";
import { setIntersemestralList } from "../../../reducers/intersemestralReducer/actions/setIntersemestralList";
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
import { setCurseTypeSelected } from "../../../reducers/intersemestralReducer/actions/setCurseTypeSelected";

const { getStateCatalogs, getSchoolCatalogs, getPeriodsCatalog, getCareerCatalogs } = Catalogs;

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
  tipo_recursamiento: [{ required: true, message: "¡El campo es requerido!" }],
  stateId: [{ required: true, message: "¡El campo es requerido!" }],
  plantel_id: [{ required: true, message: "¡El campo es requerido!" }],
  periodo_id: [{ required: false, message: "¡El campo es requerido!" }],
  semestre_id: [{ required: false, message: "¡El semestre es requerido!" }],
  carrera_id: [{ required: false, message: "¡El campo es requerido!" }],
};

const tipos_recursamiento = [
  { id: 1, description: "Recursamiento semestral", nombre: "semestral" },
  { id: 2, description: "Recursamiento intersemestral", nombre: "intersemestral" },
  { id: 3, description: "Exámen extraordinario", nombre: "extraordinario" },
];

export default () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [states, setStates] = useState([]);
  const [statesSelect, setStatesSelect] = useState([]);
  const [careers, setCareers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [enableFilters, setEnableFilters] = useState(false);
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);
  const [periods, setPeriods] = useState([]);

  const semesters = [
    { id: 1, description: "1" },
    { id: 2, description: "2" },
    { id: 3, description: "3" },
    { id: 4, description: "4" },
    { id: 5, description: "5" },
    { id: 6, description: "6" },
  ];

  const setUp = async () => {
    dispatch(setIntersemestralList([]));
    dispatch(setCurseTypeSelected([]));
    setLoading(false);
  };
  useEffect(() => {
    setUp();
  }, []);

  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    setEnableFilters(false);
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
    const periodsCatalog = await getPeriodsCatalog();
    if (periodsCatalog && periodsCatalog.success) {
      setPeriods(
        periodsCatalog.periods.map(({ id, nombre_con_mes }) => ({
          id,
          description: nombre_con_mes,
        }))
      );
    }
    setLoading(false);
  };

  const handleFinish = async (values) => {
    setLoading(true);

    if (values.plantel_id || values.periodo_id) {
      let sendData = {
        tipo_recursamiento: tipos_recursamiento.filter(e => e.id === form.getFieldsValue().tipo_recursamiento)[0].nombre,
        plantel_id: values.plantel_id,
        periodo_id: values.periodo_id,
        semestre_id: values.semestre_id,
        carrera_id: values.carrera_id
      };
      const intersemestralItems = await getFilteredIntersemestral(sendData);
      if (
        intersemestralItems.intersemestral &&
        intersemestralItems.intersemestral.length > 0 &&
        (intersemestralItems.intersemestral != null || intersemestralItems.intersemestral !== undefined)
      ) {
        dispatch(setIntersemestralList(intersemestralItems.intersemestral));
        let countData = intersemestralItems.intersemestral.length;
        Alerts.success(
          "Busqueda",
          `Resultado: ${countData} ${countData === 1 ? "registro encotrado" : "registros encotrados"
          }`
        );
      } else {
        Alerts.warning("Busqueda", "No se encontraron resultados");
        dispatch(setIntersemestralList([]));
      }
    } else {
      Alerts.warning("Busqueda", "Seleccione un plantel o algún periodo");
    }
    setLoading(false);
  };

  const handleOnClearPlantel = () => {
    setStatesSelect(null);
    setSchools([]);
    form.setFieldsValue({ stateId: null, plantel_id: null, semestre_id: null, periodo_id: null, carrera_id: null });
  };

  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  const handleOnCurseTypeChange = async (value) => {
    setStates([]);
    setSchools([]);
    setEnableFilters(false);
    dispatch(setIntersemestralList([]));
    dispatch(setCurseTypeSelected([]));
    form.setFieldsValue({ stateId: null, plantel_id: null, semestre_id: null, periodo_id: null, carrera_id: null });
    if (value) {
      dispatch(setCurseTypeSelected({ tipos_recursamiento: value }));
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
        const periodsCatalog = await getPeriodsCatalog();
        if (periodsCatalog && periodsCatalog.success) {
          setPeriods(
            periodsCatalog.periods.map(({ id, nombre_con_mes }) => ({
              id,
              description: nombre_con_mes,
            }))
          );
        }
      }
      if (statesCatalog) {
        setStates(statesCatalog);
      }
    }
  }

  const handleOnSchoolChange = async (value) => {
    if (value) {
      setEnableFilters(true);
      const careerCatalog = await getCareerCatalogs(value);
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
    } else {
      setEnableFilters(false);
    }
  }

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
              label="Tipo evaluación"
              name="tipo_recursamiento"
              rules={validations.tipo_recursamiento}
            >
              <SearchSelect
                dataset={tipos_recursamiento}
                onChange={handleOnCurseTypeChange}
              />
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
                  value={states}
                  disabled={!states.length}
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
              <SearchSelect
                dataset={schools}
                disabled={!schools.length || (!permissionList.NACIONAL && !permissionList.ESTATAL)}
                onChange={handleOnSchoolChange}
              />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Carrera" name="carrera_id">
              <SearchSelect
                dataset={careers}
                disabled={!careers.length}
              ></SearchSelect>
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Semestre:"
              name="semestre_id"
              rules={validations.semestre_id}
            >
              <SearchSelect
                dataset={semesters}
                disabled={!enableFilters}
              />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Periodo"
              name="periodo_id"
              rules={validations.periodo_id}
            >
              <SearchSelect
                dataset={periods}
                disabled={!enableFilters}
              />
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
