import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import Alerts from "../../../shared/alerts";
import { Form, Row, Col, Button, Descriptions } from "antd";
import { getFilteredTeachers } from "../../../service/TeacherService";
import CatalogService from "../../../service/CatalogService";
import StudentService from "../../../service/StudentService";
import GroupsPeriodsApi from "../../../api/GroupsPeriodsApi";
import { SaveOutlined } from "@ant-design/icons";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import { getSemesterByPeriod, PermissionValidatorFn } from "../../../shared/functions";
import { setTeachersList } from "../../../reducers/teachers/actions/setTeachers";
import { setStudentsList } from "../../../reducers/intersemestralReducer/actions/setStudentsList";
import { setIntersemestralInfo } from "../../../reducers/intersemestralReducer/actions/setIntersemestralInfo";
import { setStudentsSelected } from "../../../reducers/intersemestralReducer/actions/setStudentsSelected";
import { setAssignInterSemester, updateAssignInterSemester, setAssignSemester, updateAssignSemester } from "../../../service/IntersemestralService";
import { getSubjectRecursamientoIntersemestral, getSubjectRecursamientoSemestral } from "../../../service/TeacherAsignaturaService";
import { setExtraExam, getExtraExamById, updateExtraExam } from "../../../service/ExtraordinaryExamService";
import { setTeacherSelected } from "../../../reducers/intersemestralReducer/actions/setTeacherSelected";
import { setCurseTypeSelected } from "../../../reducers/intersemestralReducer/actions/setCurseTypeSelected";
import { getGroupsPeriod } from "../../../service/GroupsPeriodService";
import { useHistory } from "react-router-dom";


const { getGroupPeriodById } = GroupsPeriodsApi;
const { getUacByFilter, getCareerCatalogsBySchool, getSchoolCatalogs, getStateCatalogs, getPeriodsCatalog } = CatalogService;
const { getStudentsBySchoolGroup, getStudentsToExtraExam } = StudentService;
const styles = {
  colProps: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};

const tipos_recursamiento = [
  { id: 1, description: "Recursamiento semestral", nombre: "semestral" },
  { id: 2, description: "Recursamiento intersemestral", nombre: "intersemestral" },
  { id: 3, description: "Exámen extraordinario", nombre: "extraordinario" },
];

const validations = {
  tipo_recursamiento: [{ required: true, message: "¡El campo es requerido!" }],
  stateId: [{ required: true, message: "¡El campo es requerido!" }],
  plantel_id: [{ required: true, message: "¡El campo es requerido!" }],
  career_id: [{ required: true, message: "¡El campo es requerido!" }],
  semester_id: [{ required: true, message: "¡El campo es requerido!" }],
  grupo_id: [{ required: true, message: "¡El campo es requerido!" }],
  assigment_id: [{ required: true, message: "¡El campo es requerido!" }],
};

export default ({ intersemestralId, tipoRecursamiento, tipoRecursamientoNumber }) => {

  const teacher_id = useSelector((store) => store.intersemestralReducer.teacherSelectId);
  const students_selected = useSelector((store) => store.intersemestralReducer.studentSelect);
  const currentPeriod = useSelector((store) => store.permissionsReducer.period);
  const curseType = useSelector((store) => store.intersemestralReducer.curseTypeSelected);
  const periodo_id = useSelector((store) => store.intersemestralReducer.periodo);

  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [periods, setPeriods] = useState([]);
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [careers, setCareers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [group, setGroup] = useState([]);
  const [groupPeriod, setGroupPeriod] = useState([]);
  const [planteId, setPlantelId] = useState([]);
  const [carreraUacId, setCarreraUacId] = useState([]);
  const [dataLabels, setDataLabels] = useState([]);
  const userStates = useSelector((store) => store.permissionsReducer.stateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);
  const dispatch = useDispatch();
  const history = useHistory();


  const defaultDataStudent = {
    estatus_inscripcion: "Activo",
    solo_irregulares: false,
    solo_regulares: false,
    inscripcion_grupo: false,
  }

  const setUp = async () => {
    handleOnClearPlantel();
    setLoading(false)
  };

  const setUpEdit = async () => {
    setLoading(true);
    dispatch(setCurseTypeSelected({ tipos_recursamiento: tipoRecursamientoNumber }));
    var responseRecursamiento = {};
    let arrayStudents = [];
    if (tipoRecursamientoNumber === 1) {
      responseRecursamiento = await getSubjectRecursamientoSemestral(intersemestralId);
      if (responseRecursamiento && responseRecursamiento.success) {
        setDataLabels({
          estado: responseRecursamiento.teacherAsignatura.data.plantel.municipio.estado.nombre_oficial,
          plantel: responseRecursamiento.teacherAsignatura.data.plantel.cct + " - " + responseRecursamiento.teacherAsignatura.data.plantel.nombre,
          carrera: responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.clave_carrera + " - " + responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.nombre,
          semestre: responseRecursamiento.teacherAsignatura.data.grupo_periodo.semestre,
          grupo: responseRecursamiento.teacherAsignatura.data.grupo_periodo.semestre + responseRecursamiento.teacherAsignatura.data.grupo_periodo.grupo + " - " + responseRecursamiento.teacherAsignatura.data.grupo_periodo.turno,
          asignatura: responseRecursamiento.teacherAsignatura.data.carrera_uac.uac.clave_uac + " - " + responseRecursamiento.teacherAsignatura.data.carrera_uac.uac.nombre,
          docente: responseRecursamiento.teacherAsignatura.data.plantilla_docente.docente.nombre + " " + responseRecursamiento.teacherAsignatura.data.plantilla_docente.docente.primer_apellido + " " + responseRecursamiento.teacherAsignatura.data.plantilla_docente.docente.segundo_apellido,
          periodo: responseRecursamiento.teacherAsignatura.data.periodo.nombre_con_mes
        })
        dispatch(setTeacherSelected(responseRecursamiento.teacherAsignatura.data.plantilla_docente_id));
        responseRecursamiento.teacherAsignatura.data.alumno_grupo_recursamiento_semestral.map((s) => {
          arrayStudents.push({
            ...s,
            ...s.alumno,
            id: s.alumno.usuario_id,
            nombre: s.alumno.usuario.nombre,
            primer_apellido: s.alumno.usuario.primer_apellido,
            segundo_apellido: s.alumno.usuario.segundo_apellido,
            carrera: responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.clave_carrera + " - " + responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.nombre,
            periodo: s.periodo_curso.nombre_con_mes
          });
        });
        const dataStudent = {
          grupo_periodo_id: responseRecursamiento.teacherAsignatura.data.grupo_periodo_id,
          carrera_uac_id: responseRecursamiento.teacherAsignatura.data.carrera_uac_id,
          plantel_id: responseRecursamiento.teacherAsignatura.data.plantel_id,
          tipo_recursamiento: tipoRecursamiento
        }
        const responseStudentsBygroup = await getStudentsBySchoolGroup(dataStudent);
        if (responseStudentsBygroup.success) {
          dispatch(setStudentsList(responseStudentsBygroup.data))
        }
      } else {
        setLoading(false);
        history.push("/NotFound");
      }
    } else if (tipoRecursamientoNumber === 2) {
      /* setStudentsSelected */
      responseRecursamiento = await getSubjectRecursamientoIntersemestral(intersemestralId);
      if (responseRecursamiento && responseRecursamiento.success) {
        setDataLabels({
          estado: responseRecursamiento.teacherAsignatura.data.plantel.municipio.estado.nombre_oficial,
          plantel: responseRecursamiento.teacherAsignatura.data.plantel.cct + " - " + responseRecursamiento.teacherAsignatura.data.plantel.nombre,
          carrera: responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.clave_carrera + " - " + responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.nombre,
          semestre: responseRecursamiento.teacherAsignatura.data.grupo_periodo.semestre,
          grupo: responseRecursamiento.teacherAsignatura.data.grupo_periodo.semestre + responseRecursamiento.teacherAsignatura.data.grupo_periodo.grupo + " - " + responseRecursamiento.teacherAsignatura.data.grupo_periodo.turno,
          asignatura: responseRecursamiento.teacherAsignatura.data.carrera_uac.uac.clave_uac + " - " + responseRecursamiento.teacherAsignatura.data.carrera_uac.uac.nombre,
          docente: responseRecursamiento.teacherAsignatura.data.plantilla_docente.docente.nombre + " " + responseRecursamiento.teacherAsignatura.data.plantilla_docente.docente.primer_apellido + " " + responseRecursamiento.teacherAsignatura.data.plantilla_docente.docente.segundo_apellido
        })
        dispatch(setTeacherSelected(responseRecursamiento.teacherAsignatura.data.plantilla_docente_id));
        responseRecursamiento.teacherAsignatura.data.grupo_recursamiento_intersemestral.alumno_grupo_recursamiento_intersemestral.map((s) => {
          arrayStudents.push({
            ...s.alumno,
            id: s.alumno.usuario_id,
            nombre: s.alumno.usuario.nombre,
            primer_apellido: s.alumno.usuario.primer_apellido,
            segundo_apellido: s.alumno.usuario.segundo_apellido,
            carrera: responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.clave_carrera + " - " + responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.nombre,
          });
        });
        //get students
        const dataStudent = {
          grupo_periodo_id: responseRecursamiento.teacherAsignatura.data.grupo_periodo_id,
          carrera_uac_id: responseRecursamiento.teacherAsignatura.data.carrera_uac_id,
          plantel_id: responseRecursamiento.teacherAsignatura.data.plantel_id,
          tipo_recursamiento: tipoRecursamiento
        }
        const responseStudentsBygroup = await getStudentsBySchoolGroup(dataStudent);
        if (responseStudentsBygroup.success) {
          dispatch(setStudentsList(responseStudentsBygroup.data))
        }
      } else {
        setLoading(false);
        history.push("/NotFound");
      }
    } else if(tipoRecursamientoNumber === 3) {
      responseRecursamiento = await getExtraExamById(intersemestralId);
      if (responseRecursamiento && responseRecursamiento.success) {
        setDataLabels({
          estado: responseRecursamiento.teacherAsignatura.data.plantel.municipio.estado.nombre_oficial,
          plantel: responseRecursamiento.teacherAsignatura.data.plantel.cct + " - " + responseRecursamiento.teacherAsignatura.data.plantel.nombre,
          carrera: responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.clave_carrera + " - " + responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.nombre,
          semestre: responseRecursamiento.teacherAsignatura.data.grupo_periodo.semestre,
          grupo: responseRecursamiento.teacherAsignatura.data.grupo_periodo.semestre + responseRecursamiento.teacherAsignatura.data.grupo_periodo.grupo + " - " + responseRecursamiento.teacherAsignatura.data.grupo_periodo.turno,
          asignatura: responseRecursamiento.teacherAsignatura.data.carrera_uac.uac.clave_uac + " - " + responseRecursamiento.teacherAsignatura.data.carrera_uac.uac.nombre,
          docente: responseRecursamiento.teacherAsignatura.data.plantilla_docente.docente.nombre + " " + responseRecursamiento.teacherAsignatura.data.plantilla_docente.docente.primer_apellido + " " + responseRecursamiento.teacherAsignatura.data.plantilla_docente.docente.segundo_apellido
        })
        dispatch(setTeacherSelected(responseRecursamiento.teacherAsignatura.data.plantilla_docente_id));
        responseRecursamiento.teacherAsignatura.data.alumno_grupo_extraordinario.map((s) => {
          arrayStudents.push({
            ...s.alumno,
            id: s.alumno.usuario_id,
            nombre: s.alumno.usuario.nombre,
            primer_apellido: s.alumno.usuario.primer_apellido,
            segundo_apellido: s.alumno.usuario.segundo_apellido,
            carrera: responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.clave_carrera + " - " + responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera.nombre,
          });
        });
        //get students
        const dataStudent = {
          grupo_periodo_id: responseRecursamiento.teacherAsignatura.data.grupo_periodo_id,
          carrera_uac_id: responseRecursamiento.teacherAsignatura.data.carrera_uac_id,
          plantel_id: responseRecursamiento.teacherAsignatura.data.plantel_id,
        }
        const responseStudentsBygroup = await getStudentsToExtraExam(dataStudent);
        if (responseStudentsBygroup.success) {
          dispatch(setStudentsList(responseStudentsBygroup.data))
        }
      } else {
        setLoading(false);
        history.push("/NotFound");
      }
    }
    if (responseRecursamiento && responseRecursamiento.success) {
      setPlantelId(responseRecursamiento.teacherAsignatura.data.plantel_id);
      setCarreraUacId(responseRecursamiento.teacherAsignatura.data.carrera_uac_id);
      setGroupPeriod(responseRecursamiento.teacherAsignatura.data.grupo_periodo_id);
      dispatch(setIntersemestralInfo(
        {
          estado: responseRecursamiento.teacherAsignatura.data.plantel.municipio.estado_id,
          plantel: responseRecursamiento.teacherAsignatura.data.plantel.id,
          carrera: responseRecursamiento.teacherAsignatura.data.carrera_uac.carrera_id,
          carrera_uac_id: responseRecursamiento.teacherAsignatura.data.carrera_uac_id,
          tipo_recursamiento: tipoRecursamientoNumber,
          grupo: responseRecursamiento.teacherAsignatura.data.grupo_periodo_id,
        }
      ))
      dispatch(setStudentsSelected(arrayStudents))
    } else {
      setLoading(false);
      history.push("/NotFound");
    }
    setLoading(false);
  }
  useEffect(() => {
    if (intersemestralId) {
      setUpEdit();
    } else {
      setUp();
    }
  }, []);

  const handleOnCurseTypeChange = async (value) => {
    setSubjects([]);
    setPeriods([]);
    setCareers([]);
    setGroup([]);
    setSemesters([]);
    setSchools([]);
    setStates([]);
    dispatch(setTeachersList([]));
    dispatch(setTeacherSelected())
    dispatch(setStudentsList([]));
    dispatch(setStudentsSelected([]));
    dispatch(setCurseTypeSelected([]));
    form.setFieldsValue({ plantel_id: null, career_id: null, semester_id: null, periodo_id: null, grupo_id: null, assigment_id: null, stateId: null });
    if (value) {
      setLoading(true);
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
    }
  }

  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    setSubjects([]);
    setPeriods([]);
    setCareers([]);
    setGroup([]);
    setSemesters([]);
    setSchools([]);
    dispatch(setTeachersList([]));
    dispatch(setTeacherSelected())
    dispatch(setStudentsList([]));
    dispatch(setStudentsSelected([]));
    dispatch(setCurseTypeSelected([]));
    form.setFieldsValue({ plantel_id: null, career_id: null, semester_id: null, periodo_id: null, grupo_id: null, assigment_id: null });
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

  const handleOnSchoolChange = async (schoolId) => {
    setLoading(true);
    setSubjects([]);
    setPeriods([]);
    setGroup([]);
    setSemesters([]);
    dispatch(setTeachersList([]));
    dispatch(setTeacherSelected())
    dispatch(setStudentsList([]));
    dispatch(setStudentsSelected([]));
    dispatch(setCurseTypeSelected([]));
    form.setFieldsValue({ career_id: null, semester_id: null, periodo_id: null, grupo_id: null, assigment_id: null });
    //get catalogos de carreras
    const responseCareers = await getCareerCatalogsBySchool(schoolId);
    if (responseCareers.success) {
      setCareers(
        responseCareers.carreras.map(({ id, clave_carrera, nombre }) => ({
          id,
          description: clave_carrera + " - " + nombre
        }))
      );
    }
    setLoading(false);
  }

  const handleFinishFailed = () => {

  };
  const handleFinish = async (values) => {
    setLoading(true);
    if (curseType == 2 && teacher_id || curseType == 1 || curseType == 3) {
      let studentsIds = [];
      if (intersemestralId) {
        var dataE = {
          docente_asignacion_id: teacher_id,
          carrera_uac_id: carreraUacId,
          plantel_id: planteId,
          semestre: values.semester_id ? values.semester_id : dataLabels.semestre,
          max_alumnos: 4,
          grupo_periodo_id: groupPeriod,
          alumnos: []
        }
        var responseUpdateRecursamiento = [];
        if (curseType === 1) {
          studentsIds = students_selected.map((s) => {
            return {
              alumno_id: s.usuario_id,
              carrera_uac_id: !(s.carrera_uac_curso_id) ? (s.calificacion_uac?.length > 0 ? s.calificacion_uac[0].carrera_uac_id : carreraUacId) : s.carrera_uac_curso_id
            }
          });
          dataE.alumnos = studentsIds;
          responseUpdateRecursamiento = await updateAssignSemester(dataE, intersemestralId);
        } else if (curseType === 2) {
          studentsIds = students_selected.map((s) => {
            return {
              alumno_id: s.usuario_id,
            }
          });
          dataE.alumnos = studentsIds;
          responseUpdateRecursamiento = await updateAssignInterSemester(dataE, intersemestralId);
        } else if ( curseType === 3) {
          studentsIds = students_selected.map((s) => {
            return {
              alumno_id: s.usuario_id,
              carrera_uac_id: !(s.carrera_uac_curso_id) ? (s.calificacion_uac?.length > 0 ? s.calificacion_uac[0].carrera_uac_id : carreraUacId) : s.carrera_uac_curso_id
            }
          });
          dataE = {
            docente_asignacion_id: teacher_id,
            grupo_periodo_id: groupPeriod,
            carrera_uac_id: carreraUacId,
            plantel_id: planteId,
            periodo_id: periodo_id,
            alumnos: studentsIds
          }
          responseUpdateRecursamiento = await updateExtraExam(dataE, intersemestralId);
        }
        if (responseUpdateRecursamiento.success) {
          Alerts.success("Registro actualizado", "Los cambios que realizó han sido guardados");
          setUpEdit();
        }
      } else {
        if (curseType === 1) {
          studentsIds = students_selected.map((s) => {
            return {
              alumno_id: s.usuario_id,
              carrera_uac_id: !(s.carrera_uac_curso_id) ? (s.calificacion_uac?.length > 0 ? s.calificacion_uac[0].carrera_uac_id : values.assigment_id) : s.carrera_uac_curso_id
            }
          });
          const data = {
            docente_asignacion_id: teacher_id,
            grupo_periodo_id: form.getFieldsValue().grupo_id,
            carrera_uac_id: values.assigment_id,
            plantel_id: values.plantel_id,
            periodo_id: /* !PermissionValidatorFn([permissionList.PLANTEL]) ? */ form.getFieldsValue().periodo_id /* : currentPeriod.id, */,
            alumnos: studentsIds,
          };
          const responseAssignSemester = await setAssignSemester(data);
          if (responseAssignSemester.success) {
            Alerts.success("Grupo creado con exito", "Se ha creado grupo de recursamiento");
            handleOnClearPlantel();
          }
        } else if (curseType === 2) {
          studentsIds = students_selected.map((s) => {
            return {
              alumno_id: s.usuario_id
            }
          });
          const data = {
            docente_asignacion_id: teacher_id,
            carrera_uac_id: values.assigment_id,
            plantel_id: values.plantel_id,
            semestre: values.semester_id ? values.semester_id : dataLabels.semestre,
            max_alumnos: 4,
            grupo_periodo_id: form.getFieldsValue().grupo_id,
            periodo_id: /* !PermissionValidatorFn([permissionList.PLANTEL]) ? */ form.getFieldsValue().periodo_id /* : currentPeriod.id, */,
            alumnos: studentsIds
          };
          const responseAssignInterSemester = await setAssignInterSemester(data);
          if (responseAssignInterSemester.success) {
            Alerts.success("Grupo creado con exito", "Se ha creado grupo de recursamiento");
            handleOnClearPlantel();
          }
        } else if (curseType === 3) {
          studentsIds = students_selected.map((s) => {
            return {
              alumno_id: s.usuario_id,
              carrera_uac_id: !(s.carrera_uac_curso_id) ? (s.calificacion_uac?.length > 0 ? s.calificacion_uac[0].carrera_uac_id : values.assigment_id) : s.carrera_uac_curso_id
            }
          });
          const data = {
            docente_asignacion_id: teacher_id,
            grupo_periodo_id: form.getFieldsValue().grupo_id,
            carrera_uac_id: values.assigment_id,
            plantel_id: values.plantel_id,
            periodo_id: /* !PermissionValidatorFn([permissionList.PLANTEL]) ? */ form.getFieldsValue().periodo_id /* : currentPeriod.id, */,
            alumnos: studentsIds
          }
          const responseExtraExam = await setExtraExam(data);
          if (responseExtraExam.success) {
            Alerts.success("Grupo creado con exito", "Se ha creado grupo de exámen extraordinario");
            handleOnClearPlantel();
          }
        }
      }
    } else {
      Alerts.error("Rellene todos los datos");
    }
    setLoading(false);
  };

  const handleOnClearPlantel = () => {
    setTeachersList([]);
    setSubjects([]);
    setPeriods([]);
    setCareers([]);
    setGroup([]);
    setSemesters([]);
    setSchools([]);
    dispatch(setTeachersList([]));
    dispatch(setTeacherSelected())
    dispatch(setStudentsList([]));
    dispatch(setStudentsSelected([]));
    dispatch(setCurseTypeSelected([]));
    form.setFieldsValue({ stateId: null, plantel_id: null, career_id: null, semester_id: null, periodo_id: null, grupo_id: null, assigment_id: null, tipo_recursamiento: null });
  };

  const handleOnCareerChange = async (careerId) => {
    setSubjects([]);
    setPeriods([]);
    setGroup([]);
    dispatch(setTeachersList([]));
    dispatch(setTeacherSelected())
    dispatch(setStudentsList([]));
    dispatch(setStudentsSelected([]));
    dispatch(setCurseTypeSelected([]));
    form.setFieldsValue({ semester_id: null, periodo_id: null, grupo_id: null, assigment_id: null });
    /* if (!PermissionValidatorFn([permissionList.PLANTEL])) { */
      const periodsCatalog = await getPeriodsCatalog();
      if (periodsCatalog && periodsCatalog.success) {
        setPeriods(
          periodsCatalog.periods.map(({ id, nombre_con_mes, nombre }) => ({
            id,
            description: nombre_con_mes,
            name: nombre,
          }))
        );
      }
    /* } else {
      const selectedPeriod = currentPeriod.nombre;
      setSemesters(
        getSemesterByPeriod(parseInt(selectedPeriod.split("").pop()))
      );
    } */
  }

  const handleOnSemesterChange = async (semesterId) => {
    setLoading(true);
    setSubjects([]);
    dispatch(setTeachersList([]));
    dispatch(setTeacherSelected())
    dispatch(setStudentsList([]));
    dispatch(setStudentsSelected([]));
    dispatch(setCurseTypeSelected([]));
    form.setFieldsValue({ grupo_id: null, assigment_id: null });
    const responseGroups = await getGroupsPeriod({
      plantel_id: form.getFieldsValue().plantel_id,
      carrera_id: form.getFieldsValue().career_id,
      semestre: form.getFieldsValue().semester_id,
      periodo_id: /* !PermissionValidatorFn([permissionList.PLANTEL]) ? */ form.getFieldsValue().periodo_id /* : currentPeriod.id */
    });

    if (responseGroups && responseGroups.success) {
      setGroup(
        responseGroups.groups.map(({ id, semestre, turno, grupo }) => ({
          id,
          description: semestre + grupo + " - " + turno,
        }))
      );
    }
    setLoading(false);
  }

  const handleOnAssigmentChange = async (assigmentId) => {
    setLoading(true);
    dispatch(setTeachersList([]));
    dispatch(setTeacherSelected())
    dispatch(setStudentsList([]));
    dispatch(setStudentsSelected([]));
    dispatch(setCurseTypeSelected({ tipos_recursamiento: form.getFieldValue().tipo_recursamiento }));
    //get students
    defaultDataStudent.plantel_id = form.getFieldsValue().plantel_id;
    defaultDataStudent.carrera_id = form.getFieldsValue().career_id;
    dispatch(setIntersemestralInfo(
      {
        estado: form.getFieldsValue().stateId,
        plantel: form.getFieldsValue().plantel_id,
        carrera: form.getFieldsValue().career_id,
        carrera_uac_id: form.getFieldsValue().assigment_id,
        tipo_recursamiento: form.getFieldsValue().tipo_recursamiento,
        tipo_recursamiento_nombre: tipos_recursamiento.filter(e => e.id === form.getFieldsValue().tipo_recursamiento)[0]?.nombre,
        grupo: form.getFieldsValue().grupo_id
      }
    ))
    //get maestros
    /* if (form.getFieldValue().tipo_recursamiento === 2) { */
      const responseTeachers = await getFilteredTeachers({ plantel_id: form.getFieldsValue().plantel_id });
      if (responseTeachers.success) {
        dispatch(setTeachersList(responseTeachers.teachers));
      }
      var dataStudent = {};
      if(form.getFieldsValue().tipo_recursamiento === 3) {
        dataStudent = {
          grupo_periodo_id: form.getFieldsValue().grupo_id,
          carrera_id: form.getFieldsValue().career_id,
          carrera_uac_id: form.getFieldsValue().assigment_id,
          plantel_id: form.getFieldsValue().plantel_id,
        }
      } else {
        dataStudent = {
          grupo_periodo_id: form.getFieldsValue().grupo_id,
          carrera_uac_id: form.getFieldsValue().assigment_id,
          tipo_recursamiento: form.getFieldValue().tipo_recursamiento === 2 ? "intersemestral" : "semestral",
          plantel_id: form.getFieldsValue().plantel_id,
          periodo_id: /* !PermissionValidatorFn([permissionList.PLANTEL]) ? */ form.getFieldsValue().periodo_id /* : currentPeriod.id */
        }
      }
      const responseStudentsBygroup = form.getFieldsValue().tipo_recursamiento === 3 ? await getStudentsToExtraExam(dataStudent) : await getStudentsBySchoolGroup(dataStudent);
      if (responseStudentsBygroup.success) {
        dispatch(setStudentsList([]));
        dispatch(setStudentsList(responseStudentsBygroup.data))
      }
    /* } */
    setLoading(false);
  }

  const handleOnGroupChange = async (groupId) => {
    setLoading(true);
    dispatch(setTeachersList([]));
    dispatch(setStudentsList([]));
    dispatch(setStudentsSelected([]));
    dispatch(setCurseTypeSelected([]));
    form.setFieldsValue({ assigment_id: null });

    const resposeUac = await getUacByFilter({
      carrera_id: form.getFieldsValue().career_id,
      semestre: form.getFieldsValue().semester_id,
      grupo_periodo_id: form.getFieldsValue().grupo_id,
    });
    if (resposeUac.success) {
      if(form.getFieldsValue().tipo_recursamiento === 3) {
        setSubjects(
          resposeUac.type.map(({ id, uac }) => ({
            id: id,
            description: uac.clave_uac + " - " + uac.nombre,
            submodulo: uac.modulo_id
          })).filter(e => e.submodulo === null)
        )
      } else {
        setSubjects(
          resposeUac.type.map(({ id, uac }) => ({
            id: id,
            description: uac.clave_uac + " - " + uac.nombre
          }))
        )
      }
    }
    setLoading(false);
  }

  const handleOnPeriodsChange = async (periodId) => {
    setLoading(true);
    form.setFieldsValue({ assigment_id: null, semester_id: null, grupo_id: null, carrera_uac_id: null });
    setSemesters([]);
    setGroup([]);
    setSubjects([]);
    if (periodId) {
      const selectedPeriod = periods.filter((p) => p.id === periodId)[0].name;
      setSemesters(
        getSemesterByPeriod(parseInt(selectedPeriod.split("").pop()))
      );
    } else {
      setSemesters([]);
    }
    setLoading(false);
  };

  return (
    <Loading loading={loading}>
      <Form
        form={form}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        layout="vertical"
      >
        {intersemestralId ?
          (<Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <p><strong>Tipo evaluación:</strong> {tipoRecursamiento}</p>
            </Col>
            <Col {...styles.colProps}>
              <p><strong>Estado:</strong> {dataLabels.estado}</p>
            </Col>
            <Col {...styles.colProps}>
              <p><strong>Plantel:</strong> {dataLabels.plantel}</p>
            </Col>
            <Col {...styles.colProps}>
              <p><strong>Carrera:</strong> {dataLabels.carrera}</p>
            </Col>
            <Col {...styles.colProps}>
              <p><strong>Periodo:</strong> {dataLabels.periodo}</p>
            </Col>
            <Col {...styles.colProps}>
              <p><strong>Semestre:</strong> {dataLabels.semestre}</p>
            </Col>
            <Col {...styles.colProps}>
              <p><strong>Grupo:</strong> {dataLabels.grupo}</p>
            </Col>
            <Col {...styles.colProps}>
              <p><strong>Asignatura:</strong> {dataLabels.asignatura}</p>
            </Col>
            <Col {...styles.colProps}>
              <p><strong>Docente:</strong> {dataLabels.docente}</p>
            </Col>
          </Row>)
          : (
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Tipo evaluación"
                  name="tipo_recursamiento"
                  rules={validations.tipo_recursamiento}
                >
                  <SearchSelect
                    dataset={tipos_recursamiento}
                    disabled={intersemestralId}
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
                <Form.Item
                  label="Carrera"
                  name="career_id"
                  rules={validations.career_id}
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
                    label="Periodo"
                    name="periodo_id"
                    rules={validations.periodo_id}
                  >
                    <SearchSelect
                      dataset={periods}
                      disabled={!periods.length}
                      onChange={handleOnPeriodsChange}
                    />
                  </Form.Item>
                </Col>
              {/* {
                !PermissionValidatorFn([permissionList.PLANTEL]) ? 
                <Col {...styles.colProps}>
                  <Form.Item
                    label="Periodo"
                    name="periodo_id"
                    rules={validations.periodo_id}
                  >
                    <SearchSelect
                      dataset={periods}
                      disabled={!periods.length}
                      onChange={handleOnPeriodsChange}
                    />
                  </Form.Item>
                </Col> :
                null
              } */}
              <Col {...styles.colProps}>
                <Form.Item
                  label="Semestre"
                  name="semester_id"
                  rules={validations.semester_id}
                >
                  <SearchSelect
                    dataset={semesters}
                    disabled={!semesters.length}
                    onChange={handleOnSemesterChange}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Grupo"
                  name="grupo_id"
                  rules={validations.grupo_id}
                >
                  <SearchSelect
                    dataset={group}
                    disabled={!group.length}
                    onChange={handleOnGroupChange}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Asignatura"
                  name="assigment_id"
                  rules={validations.assigment_id}
                >
                  <SearchSelect
                    dataset={subjects}
                    disabled={!subjects.length}
                    onChange={handleOnAssigmentChange}
                  />
                </Form.Item>
                {!intersemestralId ? <Button type="primary" danger onClick={handleOnClearPlantel}>
                  Limpiar filtros
                </Button> : ''}
              </Col>
              <Col {...styles.colProps}></Col>
            </Row>
          )}
        <Row {...styles.rowProps}>
          <Col {...styles.colProps}>
            <PrimaryButton disabled={!(curseType === 2 && teacher_id || curseType === 1 || curseType === 3)} loading={loading} icon={<SaveOutlined />}>
              {(!intersemestralId) ? "Crear" : "Aceptar"}
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
};
