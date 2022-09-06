import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Row, Col } from "antd";
import { defaultColumn, columnProps } from "../../../shared/columns";
import {
  getEvaluationCriteriaByTeacherSubjectId,
  getRecursamientoFromDocente
} from "../../../service/TeacherService";
import EvaluationCriteria from "../groups/EvaluationCriteria";
import Binnacle from "../groups/Binnacle";
import { Loading } from "../../../shared/components";
import { useHistory } from "react-router-dom";

export default ({ teacherSubjectId }) => {
  const [infoSubject, setinfoSubject] = useState({});
  const [uacRegistrationData, setUacRegistrationData] = useState({});
  const [students, setStudents] = useState([]);
  const [evaluationSettings, setEvaluationSettings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rubricsSetting, setrubricsSetting] = useState([]);
  const [docenteAsignaturaId, setDocenteAsignaturaId] = useState(0);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const periodo = useSelector((store) => store.permissionsReducer.period.nombre_con_mes);
  const docente = useSelector((store) => store.permissionsReducer.userProfile.userProfile);

  const styles = {
    colProps: {
      xs: { span: 24 },
      md: { span: 12 },
    },
    buttonProps: {
      xs: { span: 24 },
      md: { span: 12 },
      lg: { span: 12 },
      xl: { span: 7 },
      style: { marginBottom: "1em" },
    },
    rowProps: {
      style: { marginBottom: "1em" },
    },
  };

  const columns = [
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Alumno", "nombre_completo"),
    {
      ...columnProps,
      title: "Parcial 1",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "1");
        return (
          <>
            {uac && uac.length && uac[0].calificacion !== null
              ? uac[0].calificacion
              : ""}
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Parcial 2",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "2");
        return (
          <>
            {uac && uac.length && uac[0].calificacion !== null
              ? uac[0].calificacion
              : ""}
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Parcial 3",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "3");
        return (
          <>
            {uac && uac.length && uac[0].calificacion !== null
              ? uac[0].calificacion
              : ""}
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Calificación Final",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "4");
        return (
          <>
            {uac && uac.length && uac[0].calificacion !== null
              ? uac[0].calificacion
              : ""}
          </>
        );
      },
    },
  ];

  const loadEvaluationCriterias = async (id) => {
    var responseRubrics = {};
    if (!id) {
      responseRubrics = await getEvaluationCriteriaByTeacherSubjectId(docenteAsignaturaId);
    } else {
      responseRubrics = await getEvaluationCriteriaByTeacherSubjectId(id);
    }
    if (responseRubrics && responseRubrics.success) {
      setrubricsSetting(responseRubrics.data);
    }
  };

  const setUp = async () => {
    setLoading(true);
    const response = await getRecursamientoFromDocente(teacherSubjectId);
    if (response && response.success) {
      setUacRegistrationData({
        docente_asignacion_id: response.data.plantilla_docente_id,
        plantel_id: response.data.plantel.id,
        carrera_uac_id: response.data.carrera_uac_id,
        docente_asignatura_id: response.data.docente_asignatura_id,
        grupo_recursamiento_semestral_id: response.data.id,
      });
      setDocenteAsignaturaId(response.data.docente_asignatura_id);
      await loadEvaluationCriterias(response.data.docente_asignatura_id);
      setinfoSubject({
        grupo: response.data.grupo_periodo.grupo,
        turno: response.data.grupo_periodo.turno,
        carrera: response.data.carrera_uac.carrera.nombre,
        materia: response.data.carrera_uac.uac.nombre,
        plantel: response.data.plantel.nombre,
        semestre: response.data.grupo_periodo.semestre,
      });
      setStudents(
        response.data.alumno_grupo_recursamiento_semestral
          .map((student) => {
            const defaultValue = {
              asistencia: "",
              examen: "",
              practicas: "",
              tareas: "",
            };
            const p1 = student.alumno.bitacora_evaluacion.find(
              (b) => b.parcial === "1"
            ) || {
              ...defaultValue,
              parcial: "1",
              alumno_id: student.alumno.usuario_id,
            };
            const p2 = student.alumno.bitacora_evaluacion.find(
              (b) => b.parcial === "2"
            ) || {
              ...defaultValue,
              parcial: "2",
              alumno_id: student.alumno.usuario_id,
            };
            const p3 = student.alumno.bitacora_evaluacion.find(
              (b) => b.parcial === "3"
            ) || {
              ...defaultValue,
              parcial: "3",
              alumno_id: student.alumno.usuario_id,
            };
            return {
              ...student.alumno,
              nombre_completo:
                (student.alumno.usuario.primer_apellido ? student.alumno.usuario.primer_apellido : "") +
                " " +
                (student.alumno.usuario.segundo_apellido ? student.alumno.usuario.segundo_apellido : "") +
                " " +
                (student.alumno.usuario.nombre ? student.alumno.usuario.nombre : ""),
              bitacora_evaluacion: [p1, p2, p3],
            };
          })
      );
      setEvaluationSettings(response.data.plantel.recursamiento_semestrales);
    } else {
      setLoading(false);
      history.push("/NotFound");
    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <>
      <Loading loading={loading}>
        <Row {...styles.rowProps}>
          <Col {...styles.colProps}>
            <p><strong>Docente:</strong> {docente.name} {docente.firstLastName} {docente.secondLastName}</p>
          </Col>
          <Col {...styles.colProps}>
            <p><strong>Asignatura:</strong> {infoSubject.materia}</p>
          </Col>
          <Col {...styles.colProps}>
            <p><strong>Carrera:</strong> {infoSubject.carrera}</p>
          </Col>
          <Col {...styles.colProps}>
            <p><strong>Semestre:</strong> {infoSubject.semestre}</p>
          </Col>
          <Col {...styles.colProps}>
            <p><strong>Grupo:</strong> {infoSubject.grupo} - {infoSubject.turno}</p>
          </Col>
          <Col {...styles.colProps}>
            <p><strong>Plantel:</strong> {infoSubject.plantel}</p>
          </Col>
          <Col {...styles.colProps}>
            <p><strong>Periodo:</strong> {periodo}</p>
          </Col>
        </Row>
        {evaluationSettings && evaluationSettings.length ? (
          <>
            <Row>
              {/* <Col {...styles.buttonProps}>
                <Binnacle
                  evaluationCriteria={rubricsSetting}
                  students={students}
                  setStudents={setStudents}
                  binnacleRegistrationData={uacRegistrationData}
                  currentEvaluationCriteria={evaluationSettings}
                  onSave={setUp}
                  tipoCurso="recursamiento"
                />
              </Col> */}
              <Col {...styles.buttonProps}>
                <EvaluationCriteria
                  teacherSubjectId={teacherSubjectId}
                  evaluations={rubricsSetting}
                  refreshData={loadEvaluationCriterias}
                  tipoCurso="recursamiento"
                />
              </Col>
            </Row>
            <br />
          </>
        ) : (
          false
        )}
        <Table
          rowKey="usuario_id"
          bordered
          pagination={{ position: ["topLeft", "bottomLeft"] }}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          size="small"
          dataSource={students}
        />
      </Loading>
    </>
  );
};
