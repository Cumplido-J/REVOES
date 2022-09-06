import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGroupFromSearch } from "../../reducers/groups/actions/updateGroup";
import { Form, Row, Col, Input } from "antd";
import {
  Loading,
  SearchSelect,
  PrimaryButton,
  ButtonCustomLink,
} from "../../shared/components";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import CatalogService from "../../service/CatalogService";
import {
  createGroup,
  getGroupDetails,
  updateGroup,
} from "../../service/GroupsService";
import Alerts from "../../shared/alerts";
import { useHistory } from "react-router-dom";
import PermissionValidator from "../../components/PermissionValidator";
import { permissionList } from "../../shared/constants";
import { PermissionValidatorFn } from "../../shared/functions";

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

const semesters = [
  { id: 1, description: "1" },
  { id: 2, description: "2" },
  { id: 3, description: "3" },
  { id: 4, description: "4" },
  { id: 5, description: "5" },
  { id: 6, description: "6" },
];

const validations = {
  required: [
    {
      required: true,
      message: "Este campo es requerido",
    },
  ],
};

const turnos = [
  { id: "TM", description: "TM" },
  { id: "TV", description: "TV" },
];

export default ({ groupEditId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [careers, setCareers] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);

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

  const handleFinishAdd = async (dataRaw) => {
    setLoading(true);
    const apiResponse = await createGroup(dataRaw);
    if (apiResponse.success) {
      Alerts.success("Grupo creado con exito", apiResponse.message);
      form.setFieldsValue({
        turno: null,
        grupo: null,
        semestre: null,
        carrera_id: null,
        plantel_id: null,
        stateId: null,
      });
    }
    setLoading(false);
  };

  const handleFinishEdit = async (dataRaw) => {
    setLoading(true);
    const apiResponse = await updateGroup(groupEditId, dataRaw);
    if (apiResponse && apiResponse.success) {
      const groupUpdated = apiResponse.group;
      if (groupUpdated && groupUpdated.length)
        dispatch(updateGroupFromSearch(groupUpdated));
      history.push("/Grupos");
      Alerts.success("Actualización de grupo", apiResponse.message);
    }
    setLoading(false);
  };

  const handleFinish = (values) => {
    if (groupEditId) {
      handleFinishEdit(values);
    } else {
      handleFinishAdd(values);
    }
  };

  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  useEffect(() => {
    async function setUpAdd() {
      let statesCatalog;
      if (PermissionValidatorFn([permissionList.NACIONAL])) {
        statesCatalog = await getStateCatalogs();
        if (statesCatalog) {
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
    async function setUpEdit() {
      const getGroupResponse = await getGroupDetails(groupEditId);
      let statesCatalog;
      if (PermissionValidatorFn([permissionList.NACIONAL])) {
        statesCatalog = await getStateCatalogs();
        if (statesCatalog) {
          statesCatalog = statesCatalog.states.map(({ id, description1 }) => ({
            id,
            description: description1,
          }));
        }
      } else if (PermissionValidatorFn([permissionList.ESTATAL])) {
        statesCatalog = userStates;
      } else if (PermissionValidatorFn([permissionList.PLANTEL])) {
        statesCatalog = [];
      }
      if (statesCatalog && getGroupResponse) {
        // Set State
        const groupData = getGroupResponse.group;
        setStates(statesCatalog);
        // Set Plantel
        let schoolsCatalog;
        if (
          PermissionValidatorFn(
            [permissionList.NACIONAL, permissionList.ESTATAL],
            false
          )
        ) {
          schoolsCatalog = await getSchoolCatalogs(
            groupData.plantel_carrera.plantel.municipio.estado_id
          );
          if (schoolsCatalog) {
            schoolsCatalog = schoolsCatalog.schools.map(
              ({ id, description1, description2 }) => ({
                id,
                description: `${description1} - ${description2}`,
              })
            );
          }
        } else if (PermissionValidatorFn([permissionList.PLANTEL])) {
          schoolsCatalog = userSchools;
        }
        // Set careers
        const careersCatalog = await getCareerCatalogs(
          groupData.plantel_carrera.plantel_id
        );
        if (schoolsCatalog && careersCatalog) {
          setSchools(schoolsCatalog);
          setCareers(
            careersCatalog.careers.map(
              ({ id, description1, description2 }) => ({
                id,
                description: `${description1} - ${description2}`,
              })
            )
          );
          form.setFieldsValue({
            semestre: groupData.semestre,
            grupo: groupData.grupo,
            turno: groupData.turno,
            stateId: groupData.plantel_carrera.plantel.municipio.estado_id,
            plantel_id: groupData.plantel_carrera.plantel_id,
            carrera_id: groupData.plantel_carrera.carrera_id,
          });
          setLoading(false);
        }
      }
    }
    if (groupEditId) {
      setUpEdit();
    } else {
      setUpAdd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              label="Semestre"
              name="semestre"
              rules={validations.required}
            >
              <SearchSelect dataset={semesters} />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Denominación del Grupo"
              name="grupo"
              rules={validations.required}
            >
              <Input style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Turno" name="turno" rules={validations.required}>
              <SearchSelect dataset={turnos} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...styles.rowProps}>
          <Col {...styles.colProps}>
            <ButtonCustomLink
              link="/Grupos/"
              size="large"
              icon={<ArrowLeftOutlined />}
              color="red"
            >
              Regresar a lista de grupos
            </ButtonCustomLink>
          </Col>
          <Col {...styles.colProps}>
            {/*TODO: Debe cambiar el color del boton busqueda*/}
            <PrimaryButton
              size="large"
              loading={loading}
              icon={<CheckCircleOutlined />}
            >
              Guardar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
};
