import React, { useEffect, useState } from "react";
import { Alert } from "antd";

import { ButtonCustom, PageLoading } from "../../shared/components";

import StudentService from "../../service/StudentService";

import StudentSubjectsShow from "./StudentSubjectsShow";
import StudentSubjectsForm from "./StudentSubjectsForm";

const getSubjects = async (curp) => {
  const response = await StudentService.getStudentSubjects(curp);
  if (!response.success) return [{}, false];

  const hasSubjects = response.studentInfo.subjects.length > 0;
  if (!hasSubjects) return [{}, hasSubjects];

  const studentInfo = {};

  studentInfo.totalCredits = response.studentInfo.credits;
  studentInfo.obtainedCredits = response.studentInfo.obtainedCredits;
  studentInfo.finalScore = response.studentInfo.finalScore;

  studentInfo.semester1 = response.studentInfo.subjects.filter((subject) => subject.semester === 1);
  studentInfo.semester2 = response.studentInfo.subjects.filter((subject) => subject.semester === 2);
  studentInfo.semester3 = response.studentInfo.subjects.filter((subject) => subject.semester === 3);
  studentInfo.semester4 = response.studentInfo.subjects.filter((subject) => subject.semester === 4);
  studentInfo.semester5 = response.studentInfo.subjects.filter((subject) => subject.semester === 5);
  studentInfo.semester6 = response.studentInfo.subjects.filter((subject) => subject.semester === 6);
  return [studentInfo, hasSubjects];
};

export default function StudentSubjects({ curp }) {
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState();
  const [hasSubjects, setHasSubjects] = useState(false);

  useEffect(() => {
    const getStudentInfo = async () => {
      const [studentInfo, hasSubjects] = await getSubjects(curp);
      setHasSubjects(hasSubjects);
      setStudentInfo(studentInfo);
      setLoading(false);
    };
    getStudentInfo();
  }, [curp]);

  const reloadStudentInfo = async () => {
    setLoading(true);
    const [studentInfo, hasSubjects] = await getSubjects(curp);
    setHasSubjects(hasSubjects);
    setStudentInfo(studentInfo);
    setLoading(false);
  };
  const toggleEditSubjects = () => {
    setHasSubjects(!hasSubjects);
  };

  return (
    <PageLoading loading={loading}>
      <Alert
        style={{ marginBottom: "2em" }}
        message={<strong>ATENCIÓN.</strong>}
        description="Esta sección es exclusiva para la captura de información para certificados parciales."
        type="info"
        showIcon
      />
      {hasSubjects && (
        <>
          <StudentSubjectsShow curp={curp} studentInfo={studentInfo} reloadStudentInfo={reloadStudentInfo} />
          <Alert
            style={{ marginTop: "2em", marginBottom: "2em" }}
            message={<strong>ATENCIÓN.</strong>}
            description="Si necesitas cambiar las calificaciones da click en el siguiente botón. Tendrás que rellenar de nuevo todas
        las calificaciones. No se verán reflejados los cambios hasta que guardes.."
            type="info"
            showIcon
          />
          {/*<ButtonCustom onClick={toggleEditSubjects} color="volcano" fullWidth={true}>
            Editar calificaciones
          </ButtonCustom>*/}
        </>
      )}
      {!hasSubjects && <StudentSubjectsForm curp={curp} reloadStudentInfo={reloadStudentInfo} />}
    </PageLoading>
  );
}
