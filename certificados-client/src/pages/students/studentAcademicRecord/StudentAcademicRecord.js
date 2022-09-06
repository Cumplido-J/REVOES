import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "antd";
import { Loading } from "../../../shared/components";
import EditableTable from "./EditableTable";
import AddSubject from "./AddSubject";
import StudentService from "../../../service/StudentService";
import { setAcademicRecordList } from "../../../reducers/academicRecordReducer/actions/setAcademicRecordList";
import { setSemestersStudentList } from "../../../reducers/academicRecordReducer/actions/setSemestersStudent";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";

export default ({ studentData, studentGrades }) => {
  const [loading, setLoading] = useState(false);
  /* const grades = useSelector((store) => store.academicRecordReducer.academicRecordList); */
  const dispatch = useDispatch();
  const styles = {
    colProps: {
      xs: { span: 24 },
      md: { span: 12 },
    },
    buttonProps: {
      xs: { span: 12 },
      md: { span: 12 },
      lg: { span: 6 },
    },
    rowProps: {
      style: { marginBottom: "1em" },
    },
    rowButton: {
      style: { justifyContent: "flex-end" },
    },
  };
  const setUp = async () => {
    setLoading(true);
    const studentGradesResponse = await StudentService.getAcademicRecordFromStudent(studentData?.usuario_id);
    if (studentGradesResponse && studentGradesResponse.success) {
      dispatch(setAcademicRecordList(studentGradesResponse.data[0]));
      dispatch(setSemestersStudentList(studentGradesResponse.data[0]));
    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, [studentGrades]);

  return (
    <Loading loading={loading}>
      <Row {...styles.rowProps}>
        <Col {...styles.colProps}>
          <p><strong>Matrícula:</strong> {studentData.matricula}</p>
        </Col>
        <Col {...styles.colProps}>
          <p><strong>Nombre alumno:</strong> {studentData.usuario?.nombre} {studentData.usuario?.primer_apellido} {studentData.usuario?.segundo_apellido}</p>
        </Col>
        <Col {...styles.colProps}>
          <p><strong>Semestre:</strong> {studentData.semestre}</p>
        </Col>
      </Row>
      <PermissionValidator permissions={[permissionList.EDITAR_CALIFICACIONES_HISTORICAS]}>
        <Row {...styles.rowButton}>
          <Col {...styles.buttonProps}>
            <AddSubject dataStudent={studentData} carreraId={studentData?.carrera_id} idStudent={studentData?.usuario_id} nameStudent={`${studentData?.usuario?.nombre} ${studentData?.usuario?.primer_apellido} ${studentData?.usuario?.segundo_apellido}`} onSave={setUp} />
          </Col>
        </Row>
      </PermissionValidator>
      <fieldset>
        <legend>Calificaciones</legend>
        <EditableTable refreshData={setUp} idStudent={studentData?.usuario_id} />
      </fieldset>
    </Loading>
  );
};
