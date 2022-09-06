import React, { useState, useEffect } from "react";
import { Table, Row, Col } from "antd";
import { ButtonCustom } from "../../../shared/components";
import { EditOutlined } from "@ant-design/icons";
import { defaultColumn, columnProps } from "../../../shared/columns";
import CalificacionesRecursamiento from "./CapturaCalificacionesRecursamiento";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import { getDocenteAsignaturaRecursamiento } from "../../../service/TeacherAsignaturaService";
import { useHistory } from "react-router-dom";
import { Loading } from "../../../shared/components";

export default ({ teacherSubjectId }) => {
  const [infoSubject, setinfoSubject] = useState({});
  const [uacRegistrationData, setUacRegistrationData] = useState({});
  const [students, setStudents] = useState([]);
  const [evaluationSettings, setEvaluationSettings] = useState([]);
  const [recuperacionSettings, setRecuperacionSettings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const styles = {
    colProps: {
      xs: { span: 24 },
      md: { span: 12 },
    },
    buttonProps: {
      xs: { span: 12 },
      md: { span: 6 },
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
        const uac = data.alumno.calificacion_uac.filter((e) => e.parcial === "1");
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
        const uac = data.alumno.calificacion_uac.filter((e) => e.parcial === "2");
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
        const uac = data.alumno.calificacion_uac.filter((e) => e.parcial === "3");
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
        const uac = data.alumno.calificacion_uac.filter((e) => e.parcial === "6");
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

  const handleOnViewMore = async () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    setUp();
  };

  const handleCancel = async () => {
    setIsModalVisible(false);
  };

  const setUp = async () => {
    const response = await getDocenteAsignaturaRecursamiento(teacherSubjectId);
    if(response && response.success){
      setUacRegistrationData({
        asignatura_recursamiento_intersemestral_id: response.teacherAsignatura.data.id,
        grupo_recursamiento_intersemestral_id: response.teacherAsignatura.data.grupo_recursamiento_intersemestral_id,
        docente_asignacion_id: response.teacherAsignatura.data.plantilla_docente_id,
        plantel_id: response.teacherAsignatura.data.plantel_id,
        carrera_uac_id: response.teacherAsignatura.data.carrera_uac_id,
      });
      setinfoSubject({
        carrera: response.teacherAsignatura.data.carrera_uac.carrera.nombre,
        materia: response.teacherAsignatura.data.carrera_uac.uac.nombre,
        plantel: response.teacherAsignatura.data.plantel.nombre,
        semestre: response.teacherAsignatura.data.grupo_recursamiento_intersemestral.semestre,
      });
      setStudents(
        response.teacherAsignatura.data.grupo_recursamiento_intersemestral.alumno_grupo_recursamiento_intersemestral
          .map((student) => {
            return {
              ...student,
              matricula: student.alumno.matricula,
              nombre_completo:
                student.alumno.usuario.primer_apellido +
                " " +
                student.alumno.usuario.segundo_apellido +
                " " +
                student.alumno.usuario.nombre,
            };
          })
      );
      setEvaluationSettings(response.teacherAsignatura.data.plantel.recursamiento_intersemestrales);
    } else {
      setLoading(false);
      history.push("/NotFound");
    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();

  }, [teacherSubjectId]);

  return (
    <>
    <Loading loading={loading}>
      <Row {...styles.rowProps}>
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
          <p><strong>Plantel:</strong> {infoSubject.plantel}</p>
        </Col>
      </Row>
      {evaluationSettings && evaluationSettings.length ? (
        <>
          {/* <PermissionValidator
            permissions={[permissionList.CARGAR_CALIFICACIONES_RECURSAMIENTO_INTERSEMESTRAL]}
          >
            <Row>
              <Col {...styles.buttonProps}>
                <ButtonCustom
                  size="large"
                  icon={<EditOutlined />}
                  color="blue"
                  onClick={() => {
                    handleOnViewMore();
                  }}
                >
                  Evaluar
                </ButtonCustom>
              </Col>
            </Row>
          </PermissionValidator>
          <br /> */}
        </>
      ) : (
        false
      )}
      <Table
        rowKey="alumno_id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        size="small"
        dataSource={students}
      />
      {evaluationSettings && evaluationSettings.length || recuperacionSettings && recuperacionSettings.length ? (
        <CalificacionesRecursamiento
          students={students}
          uacRegistrationData={uacRegistrationData}
          evaluaciones={evaluationSettings}
          recuperacion={recuperacionSettings}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      ) : (
        false
      )}
    </Loading>
    </>
  );
};