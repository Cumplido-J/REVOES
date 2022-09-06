import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { validateCurp } from "../../shared/functions";
import { ButtonCustomLink, Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import { adminTypeCatalogRoles, studentStatusCatalog, AdminTypesRoles, checkAdminCatalog, checkAdminCatalog2, checkAdminCatalogNivel, checkAdminCatalogUpdate1, checkAdminCatalogUpdate2, checkAdminCatalogDegree1 } from "../../shared/catalogs";
import Alerts from "../../shared/alerts";
import CatalogService from "../../service/CatalogService";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  curp: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurp(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP correcta!");
      },
    },
  ],
  name: [{ required: true, message: "¡El nombre es requerido!" }],
  firstLastName: [{ required: true, message: "¡El apellido paterno es requerido!" }],
  email: [{ required: true, message: "¡El email es requerido!", type: "email" }],
  stateId: [{ required: true, message: "¡El estado es requerido!" }],
  schoolId: [{ required: true, message: "¡El plantel es requerido!" }],
  studentStatusId: [{ required: true, message: "¡El estatus del alumno es requerido!" }],
  adminSchoolId: [{ required: true, message: "¡Control escolar dirección es requerido!" }],
  superUserId: [{ required: true, message: "¡Super usuario de control escolar es requerido!" }],
  checkAdminCatalogNivel: [{ required: true, message: "¡El cargo es necesario!" }],
  role: [{ required: true, message: "¡El rol es requerido!" }],
  password: [{ required: true, message: "¡La contraseña es requerida!" }],
  passwordConfirm: [
    { required: true, message: "La confirmación de contraseña es requerida" },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("password") === value) return Promise.resolve();
        return Promise.reject("¡Las contraseñas deben coincidir!");
      },
    }),
  ],
};

async function getStates() {
  const response = await CatalogService.getStateCatalogs();
  return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}
async function getSchools(stateId) {
  const response = await CatalogService.getSchoolCatalogs(stateId);
  return response.schools.map((school) => ({
    id: school.id,
    description: `${school.description1} - ${school.description2}`,
  }));
}
async function getCareers(schoolId) {
  const response = await CatalogService.getCareerCatalogs(schoolId);
  return response.careers.map((career) => ({
    id: career.id,
    description: `${career.description1} - ${career.description2}`,
  }));
}
async function getRole() {
  const response = await CatalogService.getRoleCatalogs();
  return response.states.map((role) => ({ id: role.id, description: role.description1 }));
}
async function getCargo() {
  const response = await CatalogService.getCargoCatalogs();
  return response.states.map((cargo) => ({ id: cargo.id, description: cargo.description1 }));
}
export default function StudentForm({ userData, onSubmit }) {
  //alert(JSON.stringify(userData))
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState({ states: [], schools: [], careers: [], roles: [], cargos: [], });

  const [adminType, setAdminType] = useState(0);
  const [actualizar, setActualizar] = useState(false);
  const [addPassword, setAddPassword] = useState(true);
  const [catalogSchoolAdmin, setCatalogSchoolAdmin] = useState(0);
  const [superUser, setSuperUser] = useState(0);
  const [nivelCheck, setNivelCheck] = useState(0);
  const [actualizarDireccion, setActualizarDireccion] = useState(false);

  async function onChangeState(stateId) {
    const schools = await getSchools(stateId);
    form.setFieldsValue({ schoolId: null, careerId: null });
    setCatalogs({ ...catalogs, schools, careers: [] });
  }

  async function onChangeSchool(schoolId) {
    const careers = await getCareers(schoolId);
    form.setFieldsValue({ careerId: null });
    setCatalogs({ ...catalogs, careers });
    if (schoolId) setSuperUser(1);
    else setSuperUser(0)
  }

  useEffect(() => {
    async function loadStates() {
      const states = await getStates();
      const roles = await getRole();
      const cargos = await getCargo();

      setCatalogs({ states, schools: [], careers: [], roles, cargos });
    }
    loadStates();
  }, []);

  useEffect(() => {
    if (!userData) return;
    async function loadSchoolsAndCareers() {
      setLoading(true);
      const [states, schools, careers, roles, cargos] = await Promise.all([
        getStates(),
        getSchools(userData.stateId),
        getCareers(userData.schoolId),
        getRole(),
        getCargo(),
        setAdminType(userData.roleId),
        //setDireccion(userData.roleId),
        setActualizar(true),
        setAddPassword(false),
        setActualizarDireccion(true),
        setNivelCheck(userData.checkAdminNivel),
        setCatalogSchoolAdmin(userData.adminSchoolId),
        //setDireccion(userData.adminSchoolId == 1 ? 1 : 0),
        setSuperUser(userData.superUserId == 0 ? 0 : 1),
      ]);
      setCatalogs({ states, schools, careers, roles, cargos });
      form.setFieldsValue({ ...userData });
      setLoading(false);
    }
    loadSchoolsAndCareers();
  }, [userData, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    await onSubmit(values);
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  const onChangeAdminType = (value) => {
    setAdminType(value);
  };
  const onChangeCatalogSchoolControl = (value) => {
    setCatalogSchoolAdmin(value);
  }

  const AdminCatalogNivel = (value) => {
    setNivelCheck(value);
  }
  return (
    <Loading loading={loading}>
      <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
        <Row {...rowProps}>
          <Form.Item name="id" >
            <Input type="hidden" style={{ width: "90%" }} />
          </Form.Item>

          <Col {...colProps}>
            <Form.Item label="USERNAME:" name="username" rules={validations.curp}>
              <Input placeholder="USERNAME" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Nombre:" name="name" rules={validations.name}>
              <Input placeholder="Nombre" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Apellido paterno:" name="firstLastName" rules={validations.firstLastName}>
              <Input placeholder="Apellido paterno" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Apellido materno:" name="secondLastName">
              <Input placeholder="Apellido materno" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Email:" name="email" rules={validations.email}>
              <Input placeholder="Email" type="email" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Estatus:" name="statusId" rules={validations.studentStatusId}>
              <SearchSelect dataset={studentStatusCatalog} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Rol:" name="roleId" rules={validations.role} >
              <SearchSelect dataset={adminTypeCatalogRoles} onChange={onChangeAdminType} />
            </Form.Item>
          </Col>

          {(adminType === AdminTypesRoles.SCHOOL_CONTROL || adminType === AdminTypesRoles.TRACING_ADMIN) && (
            <Col {...colProps}>
              {adminType != AdminTypesRoles.TRACING_ADMIN && (
                <Form.Item label="Nivel de cargo:" name="checkAdminNivel" rules={validations.checkAdminCatalogNivel}>
                  <SearchSelect dataset={checkAdminCatalogNivel} onChange={AdminCatalogNivel} />
                </Form.Item>
              )}
              {adminType != AdminTypesRoles.SCHOOL_CONTROL && (
                <Form.Item label="Nivel de cargo:" name="checkAdminNivel" rules={validations.checkAdminCatalogNivel}>
                  <SearchSelect dataset={checkAdminCatalogNivel} onChange={AdminCatalogNivel} />
                </Form.Item>
              )}
            </Col>
          )}
          {nivelCheck == 1 && adminType == AdminTypesRoles.SCHOOL_CONTROL && (
            <Col {...colProps}>
              {!actualizar && (
                <Form.Item label="Catálogo de control escolar:" name="adminSchoolId" rules={validations.adminSchoolId}>
                  <SearchSelect dataset={checkAdminCatalog} onChange={onChangeCatalogSchoolControl} />
                </Form.Item>
              )}
              {(actualizar && (userData.adminSchoolId === 2 || userData.adminSchoolId === 4)) && (
                <Form.Item label="Catálogo de control escolar:" name="adminSchoolId" rules={validations.adminSchoolId}>
                  <SearchSelect dataset={checkAdminCatalogUpdate1} onChange={onChangeCatalogSchoolControl} />
                </Form.Item>
              )}
              {(actualizar && (userData.adminSchoolId === 2 || userData.adminSchoolId === 5)) && (
                <Form.Item label="Catálogo de control escolar:" name="adminSchoolId" rules={validations.adminSchoolId}>
                  <SearchSelect dataset={checkAdminCatalogDegree1} onChange={onChangeCatalogSchoolControl} />
                </Form.Item>
              )}
              {(actualizar && (userData.adminSchoolId === 1 || userData.adminSchoolId === 3)) && (
                <Form.Item label="Catálogo de control escolar:" name="adminSchoolId" rules={validations.adminSchoolId}>
                  <SearchSelect dataset={checkAdminCatalogUpdate2} onChange={onChangeCatalogSchoolControl} />
                </Form.Item>
              )}
            </Col>
          )}
          {nivelCheck === 2 && adminType === AdminTypesRoles.SCHOOL_CONTROL && (
            <Col {...colProps}>
              <Form.Item label="Catálogo de control escolar:" name="superUserId" rules={validations.superUserId}>
                <SearchSelect dataset={checkAdminCatalog2} />
              </Form.Item>
            </Col>
          )
          }
          {(catalogSchoolAdmin === 2 || catalogSchoolAdmin === 4 || catalogSchoolAdmin === 5) && nivelCheck === 1 && adminType === AdminTypesRoles.SCHOOL_CONTROL && (
            <Col {...colProps}>
              <Form.Item label="Puesto:" name="cargoId" rules={validations.role} >
                <SearchSelect dataset={catalogs.cargos} />
              </Form.Item>
            </Col>
          )}
          {nivelCheck > 0 && (adminType === AdminTypesRoles.SCHOOL_CONTROL || adminType === AdminTypesRoles.TRACING_ADMIN) && (
            <Col {...colProps}>
              <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
                <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
              </Form.Item>
            </Col>
          )}

          {nivelCheck == 2 && (adminType === AdminTypesRoles.SCHOOL_CONTROL || adminType === AdminTypesRoles.TRACING_ADMIN) && (
            <Col {...colProps}>
              <Form.Item label="Plantel:" name="schoolId" rules={validations.schoolId}>
                <SearchSelect dataset={catalogs.schools} onChange={onChangeSchool} />
              </Form.Item>
            </Col>
          )
          }
        </Row>
        <Row {...rowProps}>
          {addPassword === true && (
            <Col {...colProps}>
              <Form.Item label="Contraseña:" name="password" rules={validations.password}>
                <Input.Password placeholder="Contraseña" style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          )}
          {addPassword === true && (
            <Col {...colProps}>
              <Form.Item label="Confirmación de contraseña:" name="passwordConfirm" rules={validations.passwordConfirm}>
                <Input.Password placeholder="Confirmación de contraseña" style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          )}
        </Row>



        <Row {...rowProps}>
          <Col {...colProps}>
            <ButtonCustomLink link="/Usuarios" size="large" icon={<ArrowLeftOutlined />} color="red">
              Regresar a la lista de usuarios
            </ButtonCustomLink>
          </Col>
          <Col {...colProps}>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Guardar usuario
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}