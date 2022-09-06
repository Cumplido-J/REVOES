import React, { useEffect, useState } from "react";
import { Loading, SearchSelect, PrimaryButton } from "../../shared/components";
import { Col, Form, Input, Row, InputNumber, DatePicker } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import CatalogService from "../../service/CatalogService";
import { PermissionValidatorFn, validateCurp } from "../../shared/functions";
import { bloodTypes, permissionList, sexEnum } from "../../shared/constants";
import { useSelector } from "react-redux";
import PermissionValidator from "../../components/PermissionValidator";
import {
  Semesters,
  StudentsStatuses,
  StudentsTrajectory,
  StudentsTypes,
  StudentsEnrollmentTypes,
  StudentsAllowGroupEnrollment,
  StudentCareerChange,
  EstatusInscripcionCombo,
  generationCatalog,
} from "../../shared/catalogs";
import StudentsAddEditFormCaptureGrades from "./StudentsAddEditFormCaptureGrades";
import StudentsAddEditFormCaptureGradesUac from "./StudentsAddEditFormCaptureGradesUac";
import alerts from "../../shared/alerts";
import StudentService from "../../service/StudentService";
import { useHistory } from "react-router-dom";
import moment from "moment";
import EditRevalidationGrades from "./studentsEdit/EditRevalidationGrades";
import useMedicalInstitutions from "../../hooks/catalogs/useMedicalInstitutions";
import useAllStatesCatalog from "../../hooks/catalogs/useAllStatesCatalog";
import CountriesSelect from "../../components/CountriesSelect";
import useCitiesCatalog from "../../hooks/catalogs/useCitiesCatalog";
import StudentTutors from "./StudentTutors";
import InputPhoto from "../../components/InputPhoto";

const {
  getStateCatalogs,
  getSchoolCatalogs,
  getCareerCatalogs,
  getStudentEnrollmentDocuments,
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
  email: [
    {
      required: true,
      type: "email",
      message: "The input is not valid E-mail!",
    },
  ],
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
};

export default ({ studentCurp }) => {
  const history = useHistory();
  // STATE
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [careers, setCareers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [form] = Form.useForm();
  const [currentStudentData, setCurrentStudentData] = useState(null);
  const [medInstitutions, loadMedInstitutions] = useMedicalInstitutions();
  const [allStates] = useAllStatesCatalog();
  const [cities, loadCities, loadingCities] = useCitiesCatalog();
  const [currentTutors, setCurrentTutors] = useState([]);
  const [studentPhoto, setStudentPhoto] = useState(null);

  // Catalogs
  const [studentsTypesFiltered, setStudentsTypesFiltered] = useState(
    StudentsTypes.map((s) => ({
      id: s,
      description: s,
    }))
  );

  const [studentsTrajectoryFiltered, setStudentsTrajectoryFiltered] = useState(
    StudentsTrajectory.map((s) => ({
      id: s,
      description: s,
    }))
  );

  const [semestersFiltered, setSemestersFiltered] = useState(Semesters);

  // Extra data to send
  const [cambioSubsistema, setCambioSubsistema] = useState(undefined);
  const [calificaciones, setCalificaciones] = useState(undefined);
  const [calificacionesUac, setCalificacionesUac] = useState(undefined);
  // Flags
  const [currentSemester, setCurrentSemester] = useState(undefined);
  // REDUCERS
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);

  const [bornCountry, setBornCountry] = useState(null);

  /**
   * SET UP FUNCTIONS
   */
  const getCatalogs = async () => {
    // Set states
    let statesCatalogs = [];
    if (PermissionValidatorFn([permissionList.NACIONAL])) {
      statesCatalogs = await getStateCatalogs();
      if (statesCatalogs && statesCatalogs.success) {
        statesCatalogs = statesCatalogs.states.map((state) => ({
          id: state.id,
          description: state.description1,
        }));
      }
    } else if (PermissionValidatorFn([permissionList.ESTATAL])) {
      statesCatalogs = userStates;
    } else if (PermissionValidatorFn([permissionList.PLANTEL])) {
      setSchools(userSchools);
    }
    setStates(statesCatalogs);
    // Set Documents
    const documentsCatalog = await getStudentEnrollmentDocuments();
    if (documentsCatalog && documentsCatalog.success) {
      setDocuments(
        documentsCatalog.data.map(({ id, nombre }) => ({
          id,
          description: nombre,
        }))
      );
    }
    await loadMedInstitutions();
  };

  const getStudentImage = async () => {
    const studentImage = await StudentService.getStudentImage(studentCurp);
    if (studentImage && studentImage.success) {
      const file = new File(
        [studentImage.data],
        `${studentCurp}.${studentImage.data.type.split("/")[1]}`,
        {
          type: studentImage.data.type,
        }
      );
      setStudentPhoto(file);
    }
  };

  const editSetup = async () => {
    await getCatalogs();
    const studentDataResponse = await StudentService.getStudentByCurp(
      studentCurp
    );
    if (studentDataResponse && studentDataResponse.success) {
      const currentStudent = studentDataResponse.student;
      setCurrentStudentData(currentStudent);
      form.setFieldsValue({
        nombre: currentStudent.usuario.nombre,
        primer_apellido: currentStudent.usuario.primer_apellido,
        segundo_apellido: currentStudent.usuario.segundo_apellido,
        permitir_inscripcion: currentStudent.permitir_inscripcion,
        cambio_carrera: currentStudent.cambio_carrera === 0 ? "No" : "Si",
        curp: studentCurp,
        email: currentStudent.usuario.email,
        matricula: currentStudent.matricula,
        estado_id: currentStudent.plantel.municipio.estado_id,
        numero_contacto: currentStudent.numero_contacto,
        numero_movil: currentStudent.numero_movil,
        direccion: currentStudent.direccion,
        codigo_postal: currentStudent.codigo_postal,
        semestre: currentStudent.semestre,
        estatus: currentStudent.estatus,
        tipo_trayectoria: currentStudent.tipo_trayectoria,
        tipo_alumno: currentStudent.tipo_alumno,
        documentos: currentStudent.documentos.map((document) => document.id),
        estatus_inscripcion: currentStudent.estatus_inscripcion,
        generacion: currentStudent.generacion,
        periodo_inicio: currentStudent.periodo_inicio
          ? moment(currentStudent.periodo_inicio)
          : null,
        periodo_termino: currentStudent.periodo_termino
          ? moment(currentStudent.periodo_termino)
          : null,
        nss: currentStudent?.expediente?.nss,
        institucion_nss: currentStudent?.expediente?.institucion_nss,
        tipo_sangre: currentStudent?.expediente?.tipo_sangre,
        fecha_nacimiento: currentStudent?.expediente?.fecha_nacimiento
          ? moment(currentStudent?.expediente?.fecha_nacimiento)
          : null,
        pais_nacimiento: currentStudent?.expediente?.pais_nacimiento,
        codigo_postal_nacimiento:
          currentStudent?.expediente?.codigo_postal_nacimiento,
        genero: currentStudent?.genero,
      });
      if (currentStudent?.expediente?.pais_nacimiento)
        handleCountryBirthChange(currentStudent?.expediente?.pais_nacimiento);

      if (currentStudent?.expediente?.estado_nacimiento_id) {
        form.setFieldsValue({
          estado_nacimiento_id:
            currentStudent?.expediente?.estado_nacimiento_id,
        });
        await handleAllStatesChange(
          currentStudent?.expediente?.estado_nacimiento_id
        );
      }
      form.setFieldsValue({
        municipio_nacimiento_id:
          currentStudent?.expediente?.municipio_nacimiento_id,
      });
      await handleOnStateChange(currentStudent.plantel.municipio.estado_id);
      form.setFieldsValue({
        plantel_id: currentStudent.plantel_id,
      });
      await handleOnSchoolChange(currentStudent.plantel_id);
      form.setFieldsValue({
        carrera_id: currentStudent.carrera_id,
      });
      setCambioSubsistema((currentStudent.tipo_trayectoria === "Transito") * 1);
      // await getStudentImage();
    }
    setLoading(false);
  };

  const addSetup = async () => {
    await getCatalogs();
    form.setFieldsValue({ documentos: [] });
    setLoading(false);
  };

  useEffect(() => {
    if (studentCurp) editSetup();
    else addSetup();
  }, []);

  /**
   * FORMS CHANGE FUNCTIONS
   */

  const handleOnGradesChange = (grades) => {
    setCalificaciones(grades);
  };

  const handleOnGradesUacChnage = (gradesUac) => {
    setCalificacionesUac(gradesUac);
  };

  const handleOnTrayectoryChange = (trayectoryType) => {
    setCambioSubsistema((trayectoryType === "Transito") * 1);
  };

  const handleOnSemesterChange = (semester) => {
    setCurrentSemester(semester);
  };

  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    const schoolsCatalog = await getSchoolCatalogs(stateId);
    if (schoolsCatalog && schoolsCatalog.success) {
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
    if (careersCatalog && careersCatalog.success) {
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

  const handleOnCareerChange = () => {};

  const handleCountryBirthChange = (country) => {
    setBornCountry(country);
    form.setFieldsValue({
      estado_nacimiento_id: null,
      municipio_nacimiento_id: null,
    });
  };

  const handleAllStatesChange = async (stateId) => {
    form.setFieldsValue({ municipio_nacimiento_id: null });
    await loadCities(stateId);
  };

  const handleOnEnrollmentTypeChange = (enrollmentType) => {
    switch (enrollmentType) {
      case "Nuevo ingreso":
        setStudentsTypesFiltered([{ id: "Regular", description: "Regular" }]);
        setStudentsTrajectoryFiltered([
          { id: "Regular", description: "Regular" },
        ]);
        setSemestersFiltered([{ id: 1, description: 1 }]);
        form.setFieldsValue({
          tipo_alumno: "Regular",
          tipo_trayectoria: "Regular",
          semestre: 1,
        });
        handleOnTrayectoryChange("Regular");
        break;
      case "Cambio carrera":
        setStudentsTypesFiltered(
          StudentsTypes.map((s) => ({
            id: s,
            description: s,
          }))
        );
        setStudentsTrajectoryFiltered([
          { id: "Regular", description: "Regular" },
        ]);
        setSemestersFiltered(Semesters.filter((s) => s.id !== 1));
        form.setFieldsValue({
          tipo_alumno: null,
          tipo_trayectoria: "Regular",
          semestre: null,
        });
        handleOnTrayectoryChange("Regular");
        break;
      case "Cambio subsistema":
        setStudentsTypesFiltered(
          StudentsTypes.map((s) => ({
            id: s,
            description: s,
          }))
        );
        setStudentsTrajectoryFiltered([
          { id: "Transito", description: "Transito" },
        ]);
        setSemestersFiltered(Semesters.filter((s) => s.id !== 1));
        form.setFieldsValue({
          tipo_alumno: null,
          tipo_trayectoria: "Transito",
          semestre: null,
        });
        handleOnTrayectoryChange("Transito");
        break;
      default:
        setStudentsTypesFiltered(
          StudentsTypes.map((s) => ({
            id: s,
            description: s,
          }))
        );
        setStudentsTrajectoryFiltered(
          StudentsTrajectory.map((s) => ({
            id: s,
            description: s,
          }))
        );
        setSemestersFiltered(Semesters);
        form.setFieldsValue({
          tipo_alumno: null,
          tipo_trayectoria: null,
          semestre: null,
        });
        handleOnTrayectoryChange(null);
        break;
    }
  };

  const handleTutorsChange = (tutors) => {
    setCurrentTutors(
      tutors.map((t) => (typeof t.id === "string" ? { ...t, id: null } : t))
    );
  };

  /**
   * SEND FORM FUNCTIONS
   */
  const handleOnFinish = async (data) => {
    setLoading(true);
    data.cambio_subsistema = cambioSubsistema;
    data.tutores = currentTutors;
    !data.matricula && (data.matricula = null);
    if (data.periodo_inicio)
      data.periodo_inicio = moment(data.periodo_inicio).format("YYYY/MM/DD");
    if (data.periodo_termino)
      data.periodo_termino = moment(data.periodo_termino).format("YYYY/MM/DD");
    if (data.fecha_nacimiento)
      data.fecha_nacimiento = moment(data.fecha_nacimiento).format(
        "YYYY/MM/DD"
      );
    if (!data.generacion) data.generacion = null;
    if (data.anio_ingreso)
      data.anio_ingreso = moment(data.anio_ingreso).format("YYYY");
    if (studentCurp) {
      // Editar alumno
      data.cambio_carrera = data.cambio_carrera === "Si" * 1;
      if (!data.fotografia && studentPhoto) data.fotografia = studentPhoto;
      await sendEditData(data);
    } else {
      // Registrar alumno
      data.cambio_carrera = (data.tipo_inscripcion === "Cambio carrera") * 1;
      if (!!cambioSubsistema) {
        data.calificaciones = calificaciones;
      } else if (currentSemester !== 1 && currentSemester !== undefined) {
        data.calificaciones_uac = calificacionesUac.map((calf) => ({
          ...calf,
          parciales: [
            calf.parcial1,
            calf.parcial2,
            calf.parcial3,
            calf.final,
            calf.extra,
          ],
        }));
        if (
          (Array.isArray(data.calificaciones_uac) &&
            !data.calificaciones_uac.length) ||
          data.calificaciones_uac.some((calf) => calf.parciales[3] === null)
        ) {
          alerts.error(
            "Error al capturar materias",
            "Verifique haber capturado las calificaciones de todas las materias."
          );
          return setLoading(false);
        }
      }
      await sendRegistrationData(data);
    }
    setLoading(false);
  };

  const dataToFormData = (data) => {
    const formData = new FormData();
    for (const dk in data) {
      if (data[dk] !== undefined && data[dk] !== null) {
        if (Array.isArray(data[dk])) {
          if (
            dk === "calificaciones_uac" ||
            dk === "calificaciones" ||
            dk === "tutores"
          ) {
            formData.append(dk, JSON.stringify(data[dk]));
          } else {
            data[dk].forEach((ddkValue) => {
              if (typeof ddkValue === "boolean") ddkValue = ddkValue * 1;
              formData.append(`${dk}[]`, ddkValue);
            });
          }
        } else if (typeof data[dk] === "boolean") {
          formData.append(dk, data[dk] * 1);
        } else {
          formData.append(dk, data[dk]);
        }
      } else {
        formData.append(dk, "");
      }
    }
    return formData;
  };

  const sendEditData = async (data) => {
    data = dataToFormData(data);
    const editDataResponse = await StudentService.studentEdit(
      currentStudentData.usuario.id,
      data
    );
    if (editDataResponse && editDataResponse.success) {
      alerts.success("Listo", "Alumno editado correctamente");
      history.push("/Estudiantes");
    }
  };

  const sendRegistrationData = async (data) => {
    data = dataToFormData(data);
    const registrationResponse = await StudentService.studentRegistration(data);
    if (registrationResponse && registrationResponse.success) {
      alerts.success("Listo", "Alumno registrado correctamente");
      history.push("/Estudiantes");
    } /* else {
      alerts.error(
        "Error al registrar el alumno",
        registrationResponse.message
      );
		}*/
  };

  const handleOnFinishFailed = () => {
    alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  const handlePhotoChange = (file) => {
    setStudentPhoto(file);
  };

  return (
    <>
      <Loading loading={loading}>
        <Form
          form={form}
          onFinish={handleOnFinish}
          onFinishFailed={handleOnFinishFailed}
          layout="vertical"
        >
          <fieldset>
            <legend>Datos administrativos</legend>
            <Row {...styles.rowProps}>
              {!studentCurp && (
                <Col {...styles.colProps}>
                  <Form.Item
                    label="Tipo inscripción"
                    name="tipo_inscripcion"
                    rules={validations.required}
                  >
                    <SearchSelect
                      onChange={handleOnEnrollmentTypeChange}
                      dataset={StudentsEnrollmentTypes.map((s) => ({
                        id: s,
                        description: s,
                      }))}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col {...styles.colProps}>
                <Form.Item
                  label="Tipo alumno"
                  name="tipo_alumno"
                  rules={validations.required}
                >
                  <SearchSelect dataset={studentsTypesFiltered} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Tipo Trayectoria"
                  name="tipo_trayectoria"
                  rules={validations.required}
                >
                  <SearchSelect
                    onChange={handleOnTrayectoryChange}
                    dataset={studentsTrajectoryFiltered}
                  />
                </Form.Item>
              </Col>
              {!studentCurp && (
                <Col {...styles.colProps}>
                  <Form.Item
                    label="Año de ingreso"
                    name="anio_ingreso"
                    rules={validations.required}
                  >
                    <DatePicker picker="year" style={{ width: "90%" }} />
                  </Form.Item>
                </Col>
              )}
              <Col {...styles.colProps}>
                <Form.Item
                  label="Permitir inscripción a un grupo"
                  name="permitir_inscripcion"
                  rules={validations.required}
                >
                  <SearchSelect
                    dataset={StudentsAllowGroupEnrollment.map((e) => ({
                      id: e,
                      description: e,
                    }))}
                  />
                </Form.Item>
              </Col>
              {studentCurp && (
                <Col {...styles.colProps}>
                  <Form.Item
                    label="Es cambio de carrera"
                    name="cambio_carrera"
                    rules={validations.required}
                  >
                    <SearchSelect
                      dataset={StudentCareerChange.map((e) => ({
                        id: e,
                        description: e,
                      }))}
                    />
                  </Form.Item>
                </Col>
              )}
              {studentCurp && (
                <Col {...styles.colProps}>
                  <Form.Item
                    label="Estatus de la inscripción"
                    name="estatus_inscripcion"
                    rules={validations.required}
                  >
                    <SearchSelect
                      dataset={EstatusInscripcionCombo.map((s) => ({
                        id: s,
                        description: s,
                      }))}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col {...styles.colProps}>
                <Form.Item label="Periodo inicio" name="periodo_inicio">
                  <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Periodo fin" name="periodo_termino">
                  <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Generación" name="generacion">
                  <SearchSelect dataset={generationCatalog} />
                </Form.Item>
              </Col>
            </Row>
          </fieldset>
          <fieldset>
            <legend>Datos de la institución</legend>
            <Row {...styles.rowProps}>
              <PermissionValidator
                permissions={[permissionList.NACIONAL, permissionList.ESTATAL]}
                allPermissions={false}
              >
                <Col {...styles.colProps}>
                  <Form.Item
                    label="Estado"
                    name="estado_id"
                    rules={validations.required}
                  >
                    <SearchSelect
                      dataset={states}
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
                  <SearchSelect
                    dataset={careers}
                    disabled={!careers.length}
                    onChange={handleOnCareerChange}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Semestre"
                  name="semestre"
                  rules={validations.required}
                >
                  <SearchSelect
                    dataset={semestersFiltered}
                    onChange={handleOnSemesterChange}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Matrícula"
                  name="matricula"
                  rules={!!studentCurp ? validations.required : undefined}
                >
                  <Input style={{ width: "90%" }} placeholder="Matrícula" />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Documentos" name="documentos">
                  <SearchSelect dataset={documents} mode="multiple" />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Estatus de documentación"
                  name="estatus"
                  rules={validations.required}
                >
                  <SearchSelect
                    dataset={StudentsStatuses.map((s) => ({
                      id: s,
                      description: s,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </fieldset>
          <fieldset>
            <legend>Datos personales del alumno</legend>
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Nombre"
                  name="nombre"
                  rules={validations.required}
                >
                  <Input
                    style={{ width: "90%" }}
                    placeholder="Nombre(s) del alumno"
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Primer Apellido"
                  name="primer_apellido"
                  rules={validations.required}
                >
                  <Input
                    style={{ width: "90%" }}
                    placeholder="Primer apellido"
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Segundo Apellido" name="segundo_apellido">
                  <Input
                    style={{ width: "90%" }}
                    placeholder="Segundo apellido"
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="País de nacimiento"
                  name="pais_nacimiento"
                  rules={validations.required}
                >
                  <CountriesSelect onChange={handleCountryBirthChange} />
                </Form.Item>
              </Col>
              {bornCountry === "Mexico" && (
                <>
                  <Col {...styles.colProps}>
                    <Form.Item
                      label="Estado de nacimiento"
                      name="estado_nacimiento_id"
                    >
                      <SearchSelect
                        dataset={allStates}
                        onChange={handleAllStatesChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...styles.colProps}>
                    <Form.Item
                      label="Municipio de nacimiento"
                      name="municipio_nacimiento_id"
                    >
                      <SearchSelect
                        dataset={cities}
                        disabled={loadingCities || !cities.length}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col {...styles.colProps}>
                <Form.Item
                  label="Código postal del lugar de nacimiento"
                  name="codigo_postal_nacimiento"
                >
                  <Input placeholder="Código postal" style={{ width: "90%" }} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Fecha de nacimiento" name="fecha_nacimiento">
                  <DatePicker format="YYYY-MM-DD" style={{ width: "90%" }} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="CURP"
                  name="curp"
                  rules={
                    !studentCurp && bornCountry !== "Mexico"
                      ? undefined
                      : validations.required
                  }
                >
                  <Input style={{ width: "90%" }} placeholder="CURP" />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Sexo" name="genero">
                  <SearchSelect dataset={sexEnum} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Correo Electrónico"
                  name="email"
                  rules={validations.email}
                >
                  <Input
                    style={{ width: "90%" }}
                    placeholder="Correo electrónico institucional"
                    maxLength={100}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Teléfono de contacto" name="numero_contacto">
                  <Input style={{ width: "90%" }} placeholder="Teléfono fijo" />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Teléfono móvil" name="numero_movil">
                  <Input
                    style={{ width: "90%" }}
                    placeholder="Teléfono celular"
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Dirección"
                  name="direccion"
                  rules={validations.required}
                >
                  <Input style={{ width: "90%" }} placeholder="Dirección" />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Código Postal"
                  name="codigo_postal"
                  rules={validations.required}
                >
                  <InputNumber
                    style={{ width: "90%" }}
                    placeholder="Código postal"
                  />
                </Form.Item>
              </Col>
              {/*	
							<Col xs={24}>
                <Form.Item label="Foto del alumno" name="fotografia">
                  <InputPhoto
                    onChange={handlePhotoChange}
                    photo={studentPhoto}
                    name="fotografia"
                  />
                </Form.Item>
							</Col>
							*/}
            </Row>
          </fieldset>
          <fieldset>
            <legend>Datos médicos</legend>
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item label="Institución Médica" name="institucion_nss">
                  <SearchSelect
                    dataset={medInstitutions.map(({ id, siglas, nombre }) => ({
                      id,
                      description: `${siglas} - ${nombre}`,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Número de Seguro Social" name="nss">
                  <Input
                    style={{ width: "90%" }}
                    placeholder="Número de Seguro Social"
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Tipo de sangre" name="tipo_sangre">
                  <SearchSelect
                    dataset={bloodTypes.map((blood) => ({
                      id: blood,
                      description: blood,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </fieldset>
          <fieldset>
            <legend>Datos de tutor(es)</legend>
            <StudentTutors
              tutors={currentStudentData?.tutores}
              loading={loading}
              onTutorsChange={handleTutorsChange}
            />
          </fieldset>
          {/*
            Si es edición (studentCurp!=undefined) se calcula si se muestra la captura de calificaciones.
          */}
          {!studentCurp &&
            (!!cambioSubsistema ? (
              <StudentsAddEditFormCaptureGrades
                onGradesChange={handleOnGradesChange}
              />
            ) : (
              currentSemester !== 1 &&
              currentSemester !== undefined && (
                <StudentsAddEditFormCaptureGradesUac
                  onGradesUacChange={handleOnGradesUacChnage}
                />
              )
            ))}
          {!!studentCurp &&
            currentStudentData?.usuario_id &&
            !!cambioSubsistema && (
              <Row {...styles.rowProps}>
                <Col {...styles.colProps}>
                  <EditRevalidationGrades
                    studentId={currentStudentData?.usuario_id}
                  />
                </Col>
              </Row>
            )}
          <PrimaryButton
            size="large"
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            Guardar
          </PrimaryButton>
        </Form>
      </Loading>
    </>
  );
};
