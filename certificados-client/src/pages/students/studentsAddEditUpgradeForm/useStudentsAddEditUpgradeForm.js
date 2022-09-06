import { useEffect, useState } from "react";
import { Form } from "antd";
import { useHistory } from "react-router-dom";
import useMedicalInstitutions from "../../../hooks/catalogs/useMedicalInstitutions";
import useAllStatesCatalog from "../../../hooks/catalogs/useAllStatesCatalog";
import useCitiesCatalog from "../../../hooks/catalogs/useCitiesCatalog";
import {
  Semesters,
  StudentsTrajectory,
  StudentsTypes,
} from "../../../shared/catalogs";
import { useSelector } from "react-redux";
import { PermissionValidatorFn } from "../../../shared/functions";
import { permissionList } from "../../../shared/constants";
import StudentService from "../../../service/StudentService";
import moment from "moment";
import alerts from "../../../shared/alerts";
import CatalogService from "../../../service/CatalogService";
import { getApplicantById } from "../../../service/ApplicantsService";

const {
  getStateCatalogs,
  getSchoolCatalogs,
  getCareerCatalogs,
  getStudentEnrollmentDocuments,
} = CatalogService;

const useStudentsAddEditUpgradeForm = ({ studentCurp, applicantId }) => {
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
    await getStudentImage();
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
  const promoteSetup = async () => {
    await getCatalogs();
    const currentApplicantResponse = await getApplicantById({
      id: applicantId,
    });
    if (currentApplicantResponse?.success) {
      form.setFieldsValue({
        nombre: currentApplicantResponse?.data?.nombre,
        primer_apellido: currentApplicantResponse?.data?.primer_apellido,
        segundo_apellido: currentApplicantResponse?.data?.segundo_apellido,
        cambio_carrera: "No",
        curp: currentApplicantResponse?.data?.curp,
        email: currentApplicantResponse?.data?.correo,
        estado_id:
          currentApplicantResponse?.data?.plantel?.municipio?.estado_id,
        numero_contacto: currentApplicantResponse?.data?.telefono,
        numero_movil: currentApplicantResponse?.data?.telefono,
        semestre: 1,
        tipo_inscripcion: "Nuevo ingreso",
        tipo_trayectoria: "Regular",
        tipo_alumno: "Regular",
        documentos: [],
        fecha_nacimiento: currentApplicantResponse?.data?.fecha_nacimiento
          ? moment(currentApplicantResponse?.data?.fecha_nacimiento)
          : null,
        direccion: currentApplicantResponse?.data?.domicilio,
      });
      setCambioSubsistema(0);
      await handleOnStateChange(
        currentApplicantResponse?.data?.plantel?.municipio?.estado_id
      );
      form.setFieldsValue({
        plantel_id: currentApplicantResponse?.data?.plantel_id,
      });
      await handleOnSchoolChange(currentApplicantResponse?.data?.plantel_id);
      form.setFieldsValue({
        carrera_id: currentApplicantResponse?.data?.carrera_id,
      });
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
    else if (applicantId) promoteSetup();
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
    console.log(data);
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
  return [
    {
      loading,
      form,
      handleOnFinish,
      handleOnFinishFailed,
      handleOnEnrollmentTypeChange,
      studentsTypesFiltered,
      handleOnTrayectoryChange,
      studentsTrajectoryFiltered,
      states,
      handleOnStateChange,
      schools,
      handleOnSchoolChange,
      careers,
      handleOnCareerChange,
      semestersFiltered,
      handleOnSemesterChange,
      documents,
      handleCountryBirthChange,
      bornCountry,
      allStates,
      handleAllStatesChange,
      cities,
      loadingCities,
      medInstitutions,
      currentStudentData,
      handleTutorsChange,
      cambioSubsistema,
      handleOnGradesChange,
      currentSemester,
      handleOnGradesUacChnage,
      studentPhoto,
      handlePhotoChange,
    },
  ];
};

export default useStudentsAddEditUpgradeForm;
