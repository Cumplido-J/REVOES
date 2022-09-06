import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Row, Col } from "antd";
import { ButtonCustom, PrimaryButton } from "../../../shared/components";
import { EditOutlined } from "@ant-design/icons";
import { defaultColumn, columnProps } from "../../../shared/columns";
import Calificaciones from "./CapturaCalificaciones";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";

export default ({ docenteAsignatura, onSave }) => {
  const [infoSubject, setinfoSubject] = useState({});
  const [uacRegistrationData, setUacRegistrationData] = useState({});
  const [students, setStudents] = useState([]);
  const [evaluationSettings, setEvaluationSettings] = useState([]);
  const [recuperacionSettings, setRecuperacionSettings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const periodo = useSelector((store) => store.permissionsReducer.period.nombre_con_mes);

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
    setUacRegistrationData({
      docente_asignacion_id: docenteAsignatura.plantilla_docente_id,
      plantel_id: docenteAsignatura.plantel_id,
      carrera_uac_id: docenteAsignatura.carrera_uac_id,
      docente_asignatura_id: docenteAsignatura.id,
      grupo_periodo_id: docenteAsignatura.grupo_periodo_id,
    });
    setinfoSubject({
      docente: docenteAsignatura && docenteAsignatura.plantilla_docente && docenteAsignatura.plantilla_docente.docente ? `${docenteAsignatura.plantilla_docente.docente.nombre} ${docenteAsignatura.plantilla_docente.docente.primer_apellido} ${docenteAsignatura.plantilla_docente.docente.segundo_apellido}` : null,
      grupo: docenteAsignatura && docenteAsignatura.grupo_periodo ? docenteAsignatura.grupo_periodo.grupo : null,
      turno: docenteAsignatura && docenteAsignatura.grupo_periodo ? docenteAsignatura.grupo_periodo.turno : null,
      carrera: docenteAsignatura && docenteAsignatura.carrera_uac && docenteAsignatura.carrera_uac.carrera ? docenteAsignatura.carrera_uac.carrera.clave_carrera+" - "+docenteAsignatura.carrera_uac.carrera.nombre : null,
      materia: docenteAsignatura && docenteAsignatura.carrera_uac && docenteAsignatura.carrera_uac.uac ?  docenteAsignatura.carrera_uac.uac.clave_uac+" - "+docenteAsignatura.carrera_uac.uac.nombre : null,
      plantel: docenteAsignatura && docenteAsignatura.plantel ? docenteAsignatura.plantel.nombre: null,
      semestre: docenteAsignatura && docenteAsignatura.grupo_periodo ? docenteAsignatura.grupo_periodo.semestre: null,
    });

    setStudents(
      docenteAsignatura && docenteAsignatura.grupo_periodo ? docenteAsignatura.grupo_periodo.alumnos
      .map((student) => {
        return {
          ...student,
          nombre_completo:
            student.usuario.primer_apellido +
            " " +
            student.usuario.segundo_apellido +
            " " +
            student.usuario.nombre,
        };
      }).concat(
        docenteAsignatura && docenteAsignatura.grupo_periodo ?
        docenteAsignatura.grupo_periodo.alumno_uac_grupo.map((student) => {
          return {
            ...student.alumno,
            nombre_completo:
              student.alumno.usuario.primer_apellido +
              " " +
              student.alumno.usuario.segundo_apellido +
              " " +
              student.alumno.usuario.nombre,
          };
        }) : null
      )
      .sort((a, b) => {
        if (a.nombre_completo > b.nombre_completo) return 1;
        if (a.nombre_completo < b.nombre_completo) return -1;

        return 0;
      }) : null
    );
    setEvaluationSettings(docenteAsignatura && docenteAsignatura.plantel ? docenteAsignatura.plantel.evaluaciones_ordinarias : null);
    setRecuperacionSettings(docenteAsignatura && docenteAsignatura.plantel && docenteAsignatura.plantel.recuperacion_parciales ? docenteAsignatura.plantel.recuperacion_parciales : null)
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
      {evaluationSettings && evaluationSettings.length || recuperacionSettings && recuperacionSettings.length ? (
        <>
          <PermissionValidator
              permissions={[permissionList.CARGAR_CALIFICACIONES_DOCENTE]}
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
        rowKey="usuario_id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        size="small"
        dataSource={students}
      />
      {evaluationSettings && evaluationSettings.length || recuperacionSettings && recuperacionSettings.length ? (
        <Calificaciones
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
    </>
  );
};