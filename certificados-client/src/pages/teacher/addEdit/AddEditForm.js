import React, { useState, useEffect } from "react";
import { Form, Row, Col, Input, DatePicker, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  Loading,
  SearchSelect,
  PrimaryButton,
  ButtonCustomLink,
} from "../../../shared/components";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import CatalogService from "../../../service/CatalogService";

import Alerts from "../../../shared/alerts";
import {
  createTeacher,
  getTeacherDetails,
  updateTeacher,
} from "../../../service/TeacherService";
import { validateCurp, validateRfc } from "../../../shared/functions";
import TableAsignaciones from "../asignacion/TableAsignaciones";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import { useHistory } from "react-router-dom";
import {
  setTeacherId,
  setTeacherView,
} from "../../../reducers/teachers/actions/setTeacherView";

const { Option } = Select;
const { TextArea } = Input;

const {
  getStateCatalogs,
  getCityCatalogs,
  getDocumentsOptions,
  getMaxStudyOptions,
  getAllStateCatalogs,
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

const gender = [
  { id: "M", description: "Masculino" },
  { id: "F", description: "Femenino" },
];

const bloodType = [
  { id: "O-", description: "O-" },
  { id: "O+", description: "O+" },
  { id: "A-", description: "A-" },
  { id: "A+", description: "A+" },
  { id: "B-", description: "B-" },
  { id: "B+", description: "B+" },
  { id: "AB-", description: "AB-" },
  { id: "AB+", description: "AB+" },
];

const validations = {
  curp: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurp(value)
          ? Promise.resolve()
          : Promise.reject("¡Ingresa una CURP correcta!");
      },
    },
  ],
  rfc: [
    {
      required: true,
      validator: (_, value) => {
        if (!value || value.length < 13)
          return Promise.reject("RFC debe contener 13 caracteres.");
        return validateRfc(value)
          ? Promise.resolve()
          : Promise.reject("¡Ingresa un RFC correcta!");
      },
    },
  ],
  num_nomina: [
    {
      required: false,
      validator: (_, value) => {
        if (value) {
          if (!value || value.length < 1)
            return Promise.reject(
              "El número de empleado debe contener al menos 1 caracter."
            );
          else if (!value || value.length > 20)
            return Promise.reject(
              "El número de empleado debe contener máximo 20 caracteres."
            );
          else return Promise.resolve();
        } else {
          return Promise.resolve();
        }
      },
    },
  ],
  cedula: [
    {
      required: false,
      validator: (_, value) => {
        if (value) {
          if (!value || value.length < 1)
            return Promise.reject(
              "La cédula debe contener al menos 1 caracteres."
            );
          else if (!value || value.length > 8)
            return Promise.reject(
              "La cédula debe contener máximo 8 caracteres."
            );
          else return Promise.resolve();
        } else {
          return Promise.resolve();
        }
      },
    },
  ],
  telefono: [
    {
      required: true,
      validator: (_, value) => {
        const valid =
          value && value.toString().length === 10 && !isNaN(parseInt(value));
        return valid
          ? Promise.resolve()
          : Promise.reject("¡Ingresa un número telefónico a 10 dígitos!");
      },
    },
  ],
  nombre: [{ required: true, message: "¡El nombre es requerido!" }],
  primer_apellido: [
    { required: true, message: "¡El apellido paterno es requerido!" },
  ],
  correo: [
    { required: true, message: "¡El email es requerido!", type: "email" },
  ],
  correo_inst: [
    { required: false, message: "¡El email es requerido!", type: "email" },
  ],
  fecha_nacimiento: [
    { required: true, message: "¡La fecha de nacimiento es requerido!" },
  ],
  direccion: [{ required: true, message: "¡La direccion es requerida!" }],
  genero: [{ required: true, message: "¡El genero es requerid!" }],
  tipo_sangre: [
    { required: true, message: "¡El tipo de sangre es requerido!" },
  ],
  docente_estatus: [
    { required: true, message: "¡Estatus del docente es requerido!" },
  ],
  ciudad_nacimiento: [
    { required: true, message: "¡La ciudad de nacimiento es requerido!" },
  ],
  ciudad_direccion: [
    { required: true, message: "¡La dirección de nacimiento es requerido!" },
  ],
  grado_estudio: [
    { required: true, message: "¡Grado de estudio es requerido!" },
  ],
  fecha_egreso: [
    {
      required: true,
      message: "¡El fecha de egreso del docente es requerido!",
    },
  ],
  estadoId: [
    {
      required: true,
      message: "¡El estado de nacimiento es requerido!",
    },
  ],
  estadoDireccionId: [
    {
      required: true,
      message: "¡El estado de dirección es requerido!",
    },
  ],
  fecha_ingreso: [
    {
      required: true,
      message: "¡El fecha de ingreso del docente es requerido!",
    },
  ],
  documento_comprobatorio: [
    { required: true, message: "¡El documento comprobatorio es requerido!" },
  ],
};

export default ({ teacherId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [maxStudyOptions, setMaxStudyOptions] = useState([]);
  const [maxStudySelect, setMaxStudySelect] = useState([]);
  const [documentsOptions, setDocumentsOptions] = useState([]);
  const [documentsSelect, setDocumentsSelect] = useState(0);
  const [citiesDireccion, setCitiesDireccion] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [teacherIsAvailable, setTeacherIsAvailable] = useState(
    false
  ); /* consultar si encontro docente */
  const [docenteActived, setDocenteActived] = useState(
    true
  ); /* consultar estatus docente para ver su disponibilidad */
  const history = useHistory();
  const dispatch = useDispatch();

  const handleOnStateDireccionChange = async (citieId) => {
    if (citieId) {
      setLoading(true);
      const citiesCatalog = await getCityCatalogs(citieId);
      if (citiesCatalog) {
        form.setFieldsValue({ ciudad_direccion: null });
        setCitiesDireccion(
          citiesCatalog.cities.map((city) => ({
            id: city.id,
            description: city.description1,
          }))
        );
      }
      setLoading(false);
    }
  };

  const handleOnStudyChange = (value) => {
    setMaxStudySelect(value);
  };

  const handleOnCitiesChange = async (citieId) => {
    if (citieId) {
      setLoading(true);
      const citiesCatalog = await getCityCatalogs(citieId);
      if (citiesCatalog) {
        form.setFieldsValue({ ciudad_nacimiento: null });
        setCities(
          citiesCatalog.cities.map((city) => ({
            id: city.id,
            description: city.description1,
          }))
        );
      }
      setLoading(false);
    }
  };

  const handleFinishAdd = async (dataRaw) => {
    setLoading(true);
    const data = {
      ...dataRaw,
      fecha_nacimiento: dataRaw.fecha_nacimiento
        ? dataRaw.fecha_nacimiento.format("YYYY-MM-DD")
        : null,
      fecha_egreso: dataRaw.fecha_egreso
        ? dataRaw.fecha_egreso.format("YYYY-MM-DD")
        : null,
      fecha_ingreso: dataRaw.fecha_ingreso
        ? dataRaw.fecha_ingreso.format("YYYY-MM-DD")
        : null,
    };
    const apiResponse = await createTeacher(data);
    if (apiResponse.success) {
      Alerts.success("Éxito", apiResponse.message);
      history.push("/Docentes");
    } else {
      /*   Alerts.error("Ocurrio un error al registrar", ""); */
    }
    form.setFieldsValue({
      turno: null,
      character: null,
      semestre: null,
      carrera_id: null,
      plantel_id: null,
      stateId: null,
    });
    setLoading(false);
  };

  const handleFinishEdit = async (dataRaw) => {
    setLoading(true);
    const data = {
      ...dataRaw,
      id: teacherId,
      fecha_nacimiento: dataRaw.fecha_nacimiento
        ? dataRaw.fecha_nacimiento.format("YYYY-MM-DD")
        : null,
      fecha_egreso: dataRaw.fecha_egreso
        ? dataRaw.fecha_egreso.format("YYYY-MM-DD")
        : null,
      fecha_ingreso: dataRaw.fecha_ingreso
        ? dataRaw.fecha_ingreso.format("YYYY-MM-DD")
        : null,
    };
    const apiResponse = await updateTeacher(teacherId, data);
    if (apiResponse.success) {
      Alerts.success("Éxito", apiResponse.message);
      history.push("/Docentes");
    } else {
      /* Alerts.error("Ocurrio un error al registrar", ""); */
    }
    setLoading(false);
  };

  const handleFinish = (values) => {
    if (teacherId) {
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

  const handleOnSelectDocument = (event) => {
    setDocumentsSelect(event);
  };

  const getCatalogsStudy = async () => {
    const maxStudy = await getMaxStudyOptions();
    let options = [];
    maxStudy.maxStudyOptions.forEach((e) => {
      options.push(
        <Option key={e.id} label={e.nombre} value={e.nombre}>
          {e.nombre}
        </Option>
      );
    });
    setMaxStudyOptions(options);
  };

  const getCatalogs = async () => {
    const documentsCatalog = await getDocumentsOptions();
    const statesCatalog = await getStateCatalogs();
    const allStatesCatalog = await getAllStateCatalogs();
    setAllStates(
      allStatesCatalog.data.map(({ id, nombre }) => ({
        id,
        description: nombre,
      }))
    );
    setStates(
      allStatesCatalog.data.map(({ id, nombre }) => ({
        id,
        description: nombre,
      }))
    );
    if (documentsCatalog) {
      let options = [];
      documentsCatalog.documentsOptions.forEach((e) => {
        options.push(
          <Option key={e.id} label={e.nombre} value={e.nombre}>
            {e.nombre}
          </Option>
        );
      });
      setDocumentsOptions(options);
    }
  };

  const setUpEdit = async () => {
    const teacherDetailsApi = await getTeacherDetails(teacherId);
    const teacherDetails = teacherDetailsApi.teacher;
    teacherDetails ? setTeacherIsAvailable(true) : setTeacherIsAvailable(false);
    if (teacherDetails) {
      //guardar estado docente info
      dispatch(setTeacherView(teacherDetails));
      /* check estatus docente */
      teacherDetails.docente_estatus !== 1
        ? setDocenteActived(false)
        : setDocenteActived(true);
      /* get cities by state */
      if (teacherDetails.lugar_nacimiento) {
        const birthCityCatalog = await getCityCatalogs(
          teacherDetails.lugar_nacimiento.estado_id
        );
        setCities(
          birthCityCatalog.cities.map(({ id, description1: description }) => ({
            id,
            description,
          }))
        );
      }
      if (teacherDetails.lugar_direccion) {
        const addressCityCatalog = await getCityCatalogs(
          teacherDetails.lugar_direccion.estado_id
        );
        setCitiesDireccion(
          addressCityCatalog.cities.map(
            ({ id, description1: description }) => ({
              id,
              description,
            })
          )
        );
      }
      /* fill form */
      fillForm(teacherDetails);
      setLoading(false);
    } else {
      setLoading(false);
      history.push("/NotFound");
    }
  };

  const fillForm = (data) => {
    /* fill documents */
    let documents_teacher_select = [];
    if (data.documento_has_docente.length > 0) {
      data.documento_has_docente.forEach((e) => {
        documents_teacher_select.push(e.documento.nombre);
      });
      setDocumentsSelect(documents_teacher_select);
    }
    form.setFieldsValue({
      nombre: data.nombre,
      primer_apellido: data.primer_apellido,
      segundo_apellido: data.segundo_apellido,
      telefono: data.telefono,
      rfc: data.rfc,
      curp: data.curp,
      num_nomina: data.num_nomina,
      direccion: data.direccion ? data.direccion : null,
      cp: data.cp,
      correo: data.correo,
      cedula: data.cedula,
      correo_inst: data.correo_inst,
      comentario: data.comentario,
      /* here */
      genero: data.genero !== null ? data.genero.toUpperCase() : null,
      /* select */
      maximo_grado_estudio: data.maximo_grado_estudio /* sss */,
      documento_comprobatorio: documents_teacher_select,
      /* search */
      tipo_sangre: data.tipo_sangre,
      estadoId: data.lugar_nacimiento ? data.lugar_nacimiento.estado_id : null,
      ciudad_nacimiento: data.cat_municipio_nacimiento_id
        ? data.cat_municipio_nacimiento_id
        : null,
      estadoDireccionId: data.lugar_direccion
        ? data.lugar_direccion.estado_id
        : null,
      ciudad_direccion: data.cat_municipio_direccion_id
        ? data.cat_municipio_direccion_id
        : null,
      /* fechas */
      fecha_nacimiento: data.fecha_nacimiento !== null ? moment(data.fecha_nacimiento, "YYYY-MM-DD") : null,
      fecha_egreso: data.fecha_egreso !== null ? moment(data.fecha_egreso, "YYYY-MM-DD") : null,
      fecha_ingreso: data.fecha_ingreso !== null ? moment(data.fecha_ingreso, "YYYY-MM-DD") : null,
    });
  };

  useEffect(() => {
    /* guardar estado del docente */
    dispatch(setTeacherId(teacherId));
    /* fill catalogs */
    getCatalogs();
    getCatalogsStudy();
    if (teacherId) {
      setUpEdit(); /* FORM EDIT/view */
    } else {
      setLoading(false); /* FORM ADD */
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
        <fieldset>
          <legend>Datos personales</legend>
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item
                label="Nombre:"
                name="nombre"
                rules={validations.nombre}
              >
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Primer Apellido:"
                name="primer_apellido"
                rules={validations.primer_apellido}
              >
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Segundo Apellido:" name="segundo_apellido">
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item
                label="Estado de nacimiento:"
                /* rules={validations.estadoId} */
                name="estadoId"
              >
                <SearchSelect
                  dataset={allStates}
                  onChange={handleOnCitiesChange}
                  disabled={!docenteActived}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Municipio de nacimiento:"
                name="ciudad_nacimiento"
              /* rules={validations.ciudad_nacimiento} */
              >
                <SearchSelect
                  dataset={cities}
                  disabled={!cities.length || !docenteActived}
                />
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item
                label="Fecha de nacimiento:"
                name="fecha_nacimiento"
              /* rules={validations.fecha_nacimiento} */
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "90%" }}
                  disabled={!docenteActived}
                />
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item
                label="Género:"
                name="genero"
              /* rules={validations.genero} */
              >
                <SearchSelect dataset={gender} disabled={!docenteActived} />
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item label="CURP:" name="curp" rules={validations.curp}>
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Estado de dirección:"
                /* rules={validations.estadoDireccionId} */
                name="estadoDireccionId"
              >
                <SearchSelect
                  dataset={states}
                  onChange={handleOnStateDireccionChange}
                  disabled={!docenteActived}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Municipio de dirección"
                /* rules={validations.ciudad_direccion} */
                name="ciudad_direccion"
              >
                <SearchSelect
                  dataset={citiesDireccion}
                  disabled={!citiesDireccion.length || !docenteActived}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Dirección:"
                /* rules={validations.direccion} */
                name="direccion"
              >
                <Input
                  placeholder="Dirección"
                  style={{ width: "90%" }}
                  /* rules={validations.direccion} */
                  disabled={!docenteActived}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Código Postal:" name="cp">
                <Input
                  placeholder="Código Postal"
                  style={{ width: "90%" }}
                  /* rules={validations.cp} */
                  disabled={!docenteActived}
                />
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item
                label="Teléfono:"
                name="telefono"
              /* rules={validations.telefono} */
              >
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Correo Electrónico:"
                name="correo"
              /* rules={validations.correo} */
              >
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Tipo de sangre:"
                name="tipo_sangre"
              /* rules={validations.tipo_sangre} */
              >
                <SearchSelect
                  style={{ width: "90%" }}
                  dataset={bloodType}
                  disabled={!docenteActived}
                />
              </Form.Item>
            </Col>
          </Row>
        </fieldset>
        <fieldset>
          <legend>Datos Académicos</legend>
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item
                label="Máximo grado de estudios:"
                name="maximo_grado_estudio"
              /* rules={validations.grado_estudio} */
              >
                <Select
                  style={{ width: "90%" }}
                  value={maxStudySelect}
                  onChange={handleOnStudyChange}
                  disabled={!docenteActived}
                >
                  {maxStudyOptions}
                </Select>
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Fecha de egreso:"
                name="fecha_egreso"
              /* rules={validations.fecha_egreso} */
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "90%" }}
                  disabled={!docenteActived}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Número de Cédula/título/Otro:"
                name="cedula"
              /* rules={validations.cedula} */
              >
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>
          </Row>
        </fieldset>
        <fieldset>
          <legend>Datos Institucionales</legend>
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item
                label="Número de empleado:"
                name="num_nomina"
              /* rules={validations.num_nomina} */
              >
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item label="RFC:" name="rfc" /* rules={validations.rfc} */>
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item
                label="Correo Institucional:"
                name="correo_inst"
              /* rules={validations.correo_inst} */
              >
                <Input style={{ width: "90%" }} disabled={!docenteActived} />
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item
                label="Documento comprobatorio:"
                name="documento_comprobatorio"
                /* rules={validations.documento_comprobatorio} */
                tooltip="Puede seleccionar más de una opción"
              >
                <Select
                  mode="multiple"
                  style={{ width: "90%" }}
                  value={documentsSelect}
                  onChange={handleOnSelectDocument}
                  disabled={!docenteActived}
                >
                  {documentsOptions}
                </Select>
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item
                label="Fecha de ingreso:"
                /* rules={validations.fecha_ingreso} */
                name="fecha_ingreso"
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "90%" }}
                  disabled={!docenteActived}
                />
              </Form.Item>
            </Col>

            <Col {...styles.colProps}>
              <Form.Item label="Comentario:" name="comentario">
                <TextArea
                  rows={4}
                  style={{ width: "90%" }}
                  disabled={!docenteActived}
                />
              </Form.Item>
            </Col>
          </Row>
        </fieldset>
        <PermissionValidator
          permissions={[permissionList.VER_ASIGNACIONES_DE_DOCENTE]}
        >
          {teacherIsAvailable && <TableAsignaciones idDocente={teacherId} />}
        </PermissionValidator>
        <Row {...styles.rowProps}>
          <Col {...styles.colProps}>
            <ButtonCustomLink
              link="/Docentes/"
              size="large"
              icon={<ArrowLeftOutlined />}
              color="red"
            >
              Regresar a lista de docentes
            </ButtonCustomLink>
          </Col>
          <Col {...styles.colProps}>
            {/*TODO: Debe cambiar el color del boton busqueda*/}
            <PrimaryButton
              size="large"
              loading={loading}
              icon={<CheckCircleOutlined />}
              disabled={!docenteActived}
            >
              Guardar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
};
