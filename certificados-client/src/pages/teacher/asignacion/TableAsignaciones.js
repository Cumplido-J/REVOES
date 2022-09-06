import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Table,
  Modal,
  Button,
  Alert,
} from "antd";
import moment from "moment";
import {
  EditOutlined,
  UserAddOutlined,
  StopOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { Loading, SearchSelect, ButtonIcon, ButtonIconHref } from "../../../shared/components";
import Alerts from "../../../shared/alerts";
import { defaultColumn, columnProps } from "../../../shared/columns";
import { setAsignacionesList } from "../../../reducers/asignacion/actions/setAsignacionesList";
import { setAsignacionView } from "../../../reducers/asignacion/actions/setAsignacion";
import { setAsignaturasDocenteList } from "../../../reducers/asignaturasDocente/actions/setAsignaturasDocenteList";
import { setAsignaturasRecursamientoIntersemestralList } from "../../../reducers/asignaturaRecursamientoIntersemestral/actions/setAsignaturasRecursamientoIntersemestralList";
import { setAsignaturasRecursamientoSemestralList } from "../../../reducers/asignaturaRecursamientoIntersemestral/actions/setAsignaturasRecursamientoSemestralList";
import { setAsignacionCareers } from "../../../reducers/asignacion/actions/setAsignacionCareers";
import Asignacion from "./Asignacion";
import {
  createAsignacion,
  updateAsignacion,
  getTeacherDetails,
  finishAsignacion,
  deleteAsignacion,
} from "../../../service/TeacherService";
import CatalogService from "../../../service/CatalogService";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import { PermissionValidatorFn } from "../../../shared/functions";

const { getStateCatalogs, getSchoolCatalogs, getTypePlaza } = CatalogService;

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 12 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};

const validations = {
  horas: [
    {
      required: true,
      validator: (_, value) => {
        if (!value) return Promise.reject("Campo requerido.");
        else if (!value || value > 50)
          return Promise.reject(
            "El número de horas debe ser menor o igual a 50."
          );
        else return Promise.resolve();
      },
    },
  ],
  estadoId: [{ required: true, message: "¡El estado es requerido!" }],
  plantel_id: [{ required: true, message: "¡El plantel es requerido!" }],
  cat_tipo_plaza_id: [
    { required: true, message: "¡El tipo de plaza es requerido!" },
  ],
  fecha_inicio_contrato: [
    { required: true, message: "¡La fecha de inicio es requerida!" },
  ],
  fecha_asignacion: [
    { required: true, message: "¡La fecha de asignación es requerida!" },
  ],
  fecha_fin_contrato: [
    {
      required: true,
      message: "¡La fecha de terminación de la asignación es requerida!",
    },
  ],
};

export default ({ idDocente }) => {
  const asignacionesList = useSelector(
    (store) => store.asignacionReducer.asignacionesList
  );
  
  const currentPeriod = useSelector(
    (store) => store.permissionsReducer.period
  );

  const [form] = Form.useForm();
  const [formDelete] = Form.useForm();
  const [formFinish] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [modalFinishAsignacion, setModalFinishAsignacion] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [modalViewAsignacion, setModalViewAsignacion] = useState(false);
  const [haveAsignaturas, setHaveAsignaturas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [typePlaza, setTypePlaza] = useState([]);
  /*   const [asignacion, setAsignacion] = useState([]); */
  const [asignacionId, setAsignacionId] = useState(null);
  const [asignacionEdit, setAsignacionEdit] = useState(false);
  const [docenteIsAvailable, setDocenteIsAvailable] = useState(false);
  const dispatch = useDispatch();
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);

  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (data) => {
        return (
          <>
            <PermissionValidator
              permissions={[permissionList.VER_DETALLES_DE_ASIGNACION]}
            >
              <ButtonIcon
                tooltip="Ver Más"
                icon={<EyeOutlined />}
                color="green"
                onClick={() => handleOnViewMore(data)}
                tooltipPlacement="top"
              />
            </PermissionValidator>
            <PermissionValidator
              permissions={[permissionList.EDITAR_ASIGNACION_DE_DOCENTE]}
            >
              {data.estatus_asignacion === "Activo" && (
                <ButtonIcon
                  tooltip="Modificar"
                  icon={<EditOutlined />}
                  color="geekblue"
                  onClick={() => handleOnUpdateAsignacion(data.id)}
                  tooltipPlacement="top"
                />
              )}
            </PermissionValidator>
            <PermissionValidator
              permissions={[permissionList.TERMINAR_ASIGNACION_DE_DOCENTE]}
            >
              {data.estatus_asignacion === "Activo" && (
                <ButtonIcon
                  tooltip="Terminar Asignación"
                  icon={<StopOutlined />}
                  color="volcano"
                  onClick={() => handleOnOkFinishAsignacion(data)}
                  tooltipPlacement="top"
                />
              )}
            </PermissionValidator>
            <PermissionValidator
              permissions={[permissionList.ELIMINAR_ASIGNACION_DE_DOCENTE]}
            >
              {data.estatus_asignacion === "Terminado" && (
                <ButtonIcon
                  tooltip="Eliminar"
                  icon={<DeleteOutlined />}
                  color="red"
                  onClick={() => handleOnOkDelete(data.id)}
                  tooltipPlacement="top"
                />
              )}
            </PermissionValidator>
              {data.nombramiento_liga !== null && (
                <ButtonIconHref
                  tooltip="Nombramiento(s)"
                  icon={<FileTextOutlined />}
                  color="geekblue"
                  href={data.nombramiento_liga}
                />
              )}
          </>
        );
      },
    },
    defaultColumn("Tipo de Plaza", "tipo_plaza"),
    defaultColumn("Tipo plantel", "tipo_plantel"),
    defaultColumn("Plantel", "plantel"),
    defaultColumn("Horas", "horas"),
    defaultColumn("Inicio de Asignación", "inicio_contrato"),
    defaultColumn("Fin de Asignación", "fin_contrato"),
    defaultColumn("Estatus", "estatus_asignacion"),
  ];

  const handleOnViewMore = async (value) => {
    dispatch(setAsignacionView(value));
    dispatch(setAsignaturasDocenteList(value.docente_asignatura));
    dispatch(setAsignaturasRecursamientoIntersemestralList(value.asignatura_recursamiento_intersemestral));
    dispatch(setAsignaturasRecursamientoSemestralList(value.grupo_recursamiento_semestral));
    dispatch(setAsignacionCareers(value.plantel_carreras));
    setModalViewAsignacion(true);
  };

  const handleOnNewAsignacion = () => {
    setVisible(true);
    setAsignacionEdit(false);
  };

  const handleOnOkFinishAsignacion = async (data) => {
    /* consultar si hay asignaturas en curso */
    if (data.asignaturas_activas.length > 0) {
      setHaveAsignaturas(true);
    } else {
      setHaveAsignaturas(false);
    }
    setModalFinishAsignacion(true);
    setAsignacionId(data.id);
  };

  const handleOnOkDelete = async (id) => {
    setVisible3(true);
    setAsignacionId(id);
  };

  const handleFormateForm = () => {
    form.resetFields();
    formFinish.resetFields();
    /* cancel edit */
    setAsignacionEdit(false);
  };

  const handleOnCancel = async () => {
    setVisible(false);
    setModalFinishAsignacion(false);
    setVisible3(false);
    setModalViewAsignacion(false);
    handleFormateForm();
  };

  const handleOnSchoolsChange = async (citieId) => {
    setLoading(true);
    setSchools([]);
    form.setFieldsValue({ plantel_id: null });
    const citiesCatalog = await getSchoolCatalogs(citieId);
    if (citiesCatalog) {
      /*   form.setFieldsValue({ ciudad_nacimiento: null }); */
      setSchools(
        citiesCatalog.schools.map((school) => ({
          id: school.id,
          description: `${school.description1} - ${school.description2}`,
        }))
      );
    }
    setLoading(false);
  };

  const handleFinishAdd = async (values) => {
    setLoading(true);
    const data = {
      ...values,
      fecha_inicio_contrato:
        values.fecha_inicio_contrato != null
          ? values.fecha_inicio_contrato.format("YYYY-MM-DD")
          : null,
      fecha_asignacion:
        values.fecha_asignacion != null
          ? values.fecha_asignacion.format("YYYY-MM-DD")
          : null,
      docente_id: idDocente,
    };
    const response = await createAsignacion(data);
    if (response.success) {
      getData();
      Alerts.success("Éxito", response.message);
    }
    setLoading(false);
  };

  const handleFinishEdit = async (values) => {
    setLoading(true);
    const data = {
      ...values,
      fecha_inicio_contrato:
        values.fecha_inicio_contrato != null
          ? values.fecha_inicio_contrato.format("YYYY-MM-DD")
          : null,
      fecha_asignacion:
        values.fecha_asignacion != null
          ? values.fecha_asignacion.format("YYYY-MM-DD")
          : null,
      docente_id: idDocente,
    };
    const response = await updateAsignacion(asignacionId, data);
    if (response.success) {
      getData();
      Alerts.success("Éxito", response.message);
    }
    setLoading(false);
  };

  const handleFinish = (values) => {
    if (asignacionEdit) {
      handleFinishEdit(values);
    } else {
      handleFinishAdd(values);
    }
  };

  const finishData = async (values) => {
    /* asignacion finalizada */
    setLoading(true);
    const param = {
      ...values,
      fecha_fin_contrato:
        values.fecha_fin_contrato != null
          ? values.fecha_fin_contrato.format("YYYY-MM-DD")
          : "",
    };
    const response = await finishAsignacion(asignacionId, param);
    if (response.success) {
      getData();
      Alerts.success(response.message, "");
    }
    setModalFinishAsignacion(false);
    setLoading(false);
  };

  const deleteData = async () => {
    /* eliminar asignacion */
    setLoading(true);
    const response = await deleteAsignacion(asignacionId);
    if (response.success) {
      getData();
      Alerts.success(response.message, "");
    }
    setVisible3(false);
    setLoading(false);
  };

  const handleOnUpdateAsignacion = async (id) => {
    setLoading(true);
    setVisible(true);
    /* editar asignacion */
    for (var i in asignacionesList) {
      if (asignacionesList[i].id === id) {
        setAsignacionId(asignacionesList[i].id);
        const citiesCatalog = await getSchoolCatalogs(
          asignacionesList[i].estado_plantel_id
        );
        setSchools(
          citiesCatalog.schools.map((school) => ({
            id: school.id,
            description: `${school.description1} - ${school.description2}`,
          }))
        );
        /* llenar form de informacion */
        form.setFieldsValue({
          ...asignacionesList[i],
          fecha_inicio_contrato: moment(
            asignacionesList[i].inicio_contrato,
            "YYYY-MM-DD"
          ),
          fecha_asignacion: moment(
            asignacionesList[i].asignacion_contrato,
            "YYYY-MM-DD"
          ),
          estadoId: asignacionesList[i].estado_plantel_id,
          cat_tipo_plaza_id: asignacionesList[i].tipo_plaza_id,
          plantel_id: asignacionesList[i].plantelId,
        });
      }
    }
    setAsignacionEdit(true);
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  const setUp = async () => {
    const typePlazaCatalog = await getTypePlaza();
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
    if (typePlazaCatalog) {
      setTypePlaza(
        typePlazaCatalog.type.map(({ id, nombre }) => ({
          id,
          description: nombre,
        }))
      );
    }
    /*  setLoading(false); */
  };

  const getData = async () => {
    /* obtener datos de docente */
    /*  setLoading(true); */
    const teacherDetailsApi = await getTeacherDetails(idDocente);
    const teacherDetails = teacherDetailsApi.teacher;
    if (teacherDetails.docente_estatus === 1) {
      setDocenteIsAvailable(true);
    } else {
      setDocenteIsAvailable(false);
    }
    if (teacherDetails && teacherDetails.docente_plantilla.length > 0) {
      teacherDetails["periodo_actual"] = currentPeriod;
      dispatch(setAsignacionesList(teacherDetails));
      /* setAsignacion(data); */
      form.resetFields();
      handleOnCancel();
      /*  setLoading(false); */
    } else {
      /* vacio */
      teacherDetails["periodo_actual"] = currentPeriod;
      dispatch(setAsignacionesList(teacherDetails));
    }
  };

  useEffect(() => {
    getData();
    setUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PermissionValidator
        permissions={[permissionList.CREAR_ASIGNACION_DE_DOCENTE]}
      >
        <Button
          icon={<UserAddOutlined />}
          color={"blue"}
          disabled={!docenteIsAvailable}
          onClick={handleOnNewAsignacion}
        >
          Nueva Asignación
        </Button>
      </PermissionValidator>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={asignacionesList}
        size="small"
      />
      {/* editar o agregar asignacion */}
      <Modal
        visible={visible}
        title={asignacionEdit ? "Editar Asignación" : "Nueva Asignación"}
        onOk={form.submit}
        onCancel={handleOnCancel}
        width={600}
        confirmLoading={loading}
      >
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
                    label="Estado:"
                    name="estadoId"
                    rules={validations.estadoId}
                  >
                    <SearchSelect
                      dataset={states}
                      onChange={handleOnSchoolsChange}
                    />
                  </Form.Item>
                </Col>
              </PermissionValidator>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Plantel:"
                  name="plantel_id"
                  rules={validations.plantel_id}
                >
                  <SearchSelect dataset={schools} disabled={!schools.length} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Tipo de plaza:"
                  name="cat_tipo_plaza_id"
                  rules={validations.cat_tipo_plaza_id}
                >
                  <SearchSelect dataset={typePlaza} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Fecha asignación:"
                  name="fecha_asignacion"
                  rules={validations.fecha_asignacion}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ width: "90%" }} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Fecha inicio:"
                  name="fecha_inicio_contrato"
                  rules={validations.fecha_inicio_contrato}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ width: "90%" }} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Horas:"
                  name="horas"
                  rules={validations.horas}
                >
                  <Input style={{ width: "90%" }} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Enlace al nombramiento:"
                  name="nombramiento_liga"
                >
                  <Input style={{ width: "90%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Loading>
      </Modal>

      {/* modal view asginacion*/}
      <Modal
        visible={modalViewAsignacion}
        title="Asignación"
        width={1250}
        onCancel={handleOnCancel}
        style={{ top: 20 }}
        footer={null}
      >
        <Asignacion />
      </Modal>

      {/* modal finish asginacion */}
      <Modal
        visible={modalFinishAsignacion}
        title="Terminar Asignación"
        onOk={formFinish.submit}
        onCancel={handleOnCancel}
        confirmLoading={loading}
        cancelButtonProps={
          haveAsignaturas ? { style: { display: "none" } } : ""
        }
        okButtonProps={haveAsignaturas ? { style: { display: "none" } } : ""}
      >
        {haveAsignaturas && (
          <Alert
            message="La asignación cuenta con asignaturas en curso"
            type="warning"
            showIcon
          />
        )}
        {!haveAsignaturas && (
          <Loading loading={loading}>
            <Form
              form={formFinish}
              onFinish={finishData}
              onFinishFailed={handleFinishFailed}
              layout="vertical"
            >
              <Row {...styles.rowProps}>
                <Col {...styles.colProps}>
                  <Form.Item
                    label="Fecha de terminación de la Asignación:"
                    name="fecha_fin_contrato"
                    rules={validations.fecha_fin_contrato}
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: "90%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Loading>
        )}
      </Modal>

      {/* modal delete asginacion  */}
      <Modal
        visible={visible3}
        title="Eliminar Asignación"
        onOk={formDelete.submit}
        onCancel={handleOnCancel}
        confirmLoading={loading}
      >
        <p>¿Está seguro de realizar esta acción?</p>
        <Loading loading={loading}>
          <Form
            form={formDelete}
            onFinish={deleteData}
            onFinishFailed={handleFinishFailed}
            layout="vertical"
          ></Form>
        </Loading>
      </Modal>
    </>
  );
};
