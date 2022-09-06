import React, { useState, useEffect } from "react";
import { Table, Row, Col } from "antd";
import { ButtonCustom, PrimaryButton } from "../../../shared/components";
import { EditOutlined } from "@ant-design/icons";
import { defaultColumn, columnProps } from "../../../shared/columns";
//import CalificacionesRecursamiento from "./CapturaCalificacionesRecursamiento";
import CalificacionesExtra from "./CapturaCalificacionesExtraordinario";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";

export default ({ docenteAsignatura, onSave, tipoRecursamiento }) => {
  const [infoSubject, setinfoSubject] = useState([]);
  const [uacRegistrationData, setUacRegistrationData] = useState({});
  const [students, setStudents] = useState([]);
  const [evaluationSettings, setEvaluationSettings] = useState([]);
  const [recuperacionSettings, setRecuperacionSettings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tipoRecursamientoActual, setTipoRecursamientoActual] = useState(0);

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
      title: "Calificación",
      render: (data) => {
        const uac = data.calificacionesEXT.filter((e) => e.parcial === "5");
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
    onSave();
  };

  const handleCancel = async () => {
    setIsModalVisible(false);
  };

  const setUp = async () => {
    setTipoRecursamientoActual(tipoRecursamiento);
    const dataForSet = {
      grupo_extraordinario_id: docenteAsignatura.id,
      docente_asignacion_id: docenteAsignatura.plantilla_docente_id,
      plantel_id: docenteAsignatura.plantel_id,
      carrera_uac_id: docenteAsignatura.carrera_uac_id,
    };
    setUacRegistrationData(dataForSet);
    setinfoSubject({
      docente: docenteAsignatura && docenteAsignatura.plantilla_docente && docenteAsignatura.plantilla_docente.docente ? `${docenteAsignatura.plantilla_docente.docente.nombre} ${docenteAsignatura.plantilla_docente.docente.primer_apellido} ${docenteAsignatura.plantilla_docente.docente.segundo_apellido}` : null,
      carrera: docenteAsignatura && docenteAsignatura.carrera_uac && docenteAsignatura.carrera_uac.carrera ? docenteAsignatura.carrera_uac.carrera.clave_carrera+" - "+docenteAsignatura.carrera_uac.carrera.nombre : null,
      materia: docenteAsignatura && docenteAsignatura.carrera_uac && docenteAsignatura.carrera_uac.uac ?  docenteAsignatura.carrera_uac.uac.clave_uac+" - "+docenteAsignatura.carrera_uac.uac.nombre : null,
      plantel: docenteAsignatura.plantel?.nombre,
      semestre: docenteAsignatura.grupo_periodo?.semestre,
      grupo: docenteAsignatura && docenteAsignatura.grupo_periodo ? docenteAsignatura.grupo_periodo.grupo : null,
      periodo: docenteAsignatura.periodo?.nombre_con_mes,
    });
    var studentsGroup = tipoRecursamiento === 1 ? docenteAsignatura?.alumno_grupo_recursamiento_semestral : tipoRecursamiento === 2 ? docenteAsignatura.grupo_recursamiento_intersemestral?.alumno_grupo_recursamiento_intersemestral : tipoRecursamiento === 3 ? docenteAsignatura.alumno_grupo_extraordinario  : null
    setStudents(
      studentsGroup?.map((student) => {
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
    setEvaluationSettings(docenteAsignatura?.plantel?.config_extraordinario);
    setRecuperacionSettings(docenteAsignatura?.plantel?.config_extraordinario)
  };

  useEffect(() => {
    setUp();

  }, [docenteAsignatura]);

  return (
    <>
      <Row {...styles.rowProps}>
        <Col {...styles.colProps}>
          <p><strong>Docente:</strong> {infoSubject.docente}</p>
        </Col>
        <Col {...styles.colProps}>
          <p><strong>Asignatura:</strong> {infoSubject.materia}</p>
        </Col>
        <Col {...styles.colProps}>
          <p><strong>Carrera:</strong> {infoSubject.carrera}</p>
        </Col>
        <Col {...styles.colProps}>
          <p><strong>semestre:</strong> {infoSubject.semestre} </p>
        </Col>
        <Col {...styles.colProps}>
          <p><strong>Grupo:</strong> {infoSubject.grupo} </p>
        </Col>
        <Col {...styles.colProps}>
          <p><strong>Plantel:</strong> {infoSubject.plantel}</p>
        </Col>
        <Col {...styles.colProps}>
          <p><strong>Periodo:</strong> {infoSubject.periodo}</p>
        </Col>
      </Row>
      {evaluationSettings && evaluationSettings.length || recuperacionSettings && recuperacionSettings.length ? (
        <>
          <PermissionValidator
            permissions={[permissionList.CARGAR_CALIFICACIONES_RECURSAMIENTO_INTERSEMESTRAL]}
          >
            <Row>
              <Col {...styles.buttonProps}>
                <PrimaryButton
                  size="large"
                  icon={<EditOutlined />}
                  color="blue"
                  onClick={() => {
                    handleOnViewMore();
                  }}
                >
                  Evaluar
                </PrimaryButton>
              </Col>
            </Row>
          </PermissionValidator>
          <br />
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
        <CalificacionesExtra
          students={students}
          uacRegistrationData={uacRegistrationData}
          evaluaciones={evaluationSettings}
          recuperacion={recuperacionSettings}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          tipoRecursamiento={tipoRecursamientoActual}
        />
      ) : (
        false
      )}
    </>
  );
};