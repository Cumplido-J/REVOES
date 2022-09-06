import { Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import StudentAddEditForm from "../StudentAddEditForm";
import EnrollSubject from "../EnrollSubject/EnrollSubject";
import StudentService from "../../../service/StudentService";
import StudentAcademicRecord from "../studentAcademicRecord/StudentAcademicRecord";
import { Alert } from "antd";
import { permissionList } from "../../../shared/constants";
import StudentsAddEditUpgradeForm from "../studentsAddEditUpgradeForm/StudentsAddEditUpgradeForm";
/*
 * Group search main component
 * */
const breadCrumbLinks = [
  {
    text: "Alumnos",
    path: "/Estudiantes",
  },
  {
    text: "Editar Alumno",
    path: false,
  },
];
export default ({ match }) => {
  const currentPermissions = useSelector(
    (store) => store.permissionsReducer.permissions
  );

  const currentPeriod = useSelector((store) => store.permissionsReducer.period);
  
  const [studentData, setStudentData] = useState({});
  const [studentGrades, setStudentGrades] = useState([]);
  const dispatch = useDispatch();

  const setUp = async () => {
    const studentDataResponse = await StudentService.getStudentByCurp(
      match.params.curp
    );
    if (studentDataResponse && studentDataResponse.success) {
      setStudentData(studentDataResponse.student);
      const studentGradesResponse =
        await StudentService.getAcademicRecordFromStudent(
          studentDataResponse.student.usuario_id
        );
      if (studentGradesResponse && studentGradesResponse.success) {
        setStudentGrades(studentGradesResponse.data[0]);
      }
    }
  };

  useEffect(() => {
    setUp();
  }, []);
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Editar información del alumno</TitleBar>
      {studentData?.cantidad_materias_reprobadas >= 3 && (
        <Alert
          message={<strong>Atención</strong>}
          description={
            <>
              <p>
                Este alumno tiene{" "}
                <b>{studentData?.cantidad_materias_reprobadas}</b> materias
                reprobadas.
              </p>
            </>
          }
          type="warning"
          showIcon
        />
      )}
      <br />
      <Tabs defaultActiveKey={1} type="card">
        <Tabs.TabPane tab="Editar datos del alumno" key="1">
          <StudentsAddEditUpgradeForm studentCurp={match.params.curp} />
        </Tabs.TabPane>
        {studentData && studentData.tipo_alumno === "Irregular" ? (
          <Tabs.TabPane tab="Inscribir en materia" key="2">
            <EnrollSubject studentData={studentData} />
          </Tabs.TabPane>
        ) : (
          ""
        )}
        {[permissionList.VER_CALIFICACIONES_HISTORICAS].some(
          (p) => currentPermissions.includes(p) && new Date(currentPeriod.fecha_inicio) > new Date(studentGrades.periodo_inicio) /* && studentGrades.semestre > 1 */
        ) ? (
          <Tabs.TabPane tab="Historial de calificaciones" key="3">
            <StudentAcademicRecord
              studentGrades={studentGrades}
              studentData={studentData}
            />
          </Tabs.TabPane>
        ) : (
          ""
        )}
      </Tabs>
    </>
  );
};
