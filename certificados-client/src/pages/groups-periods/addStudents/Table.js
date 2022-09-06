import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Table, Row, Col, Input, Button, Typography } from "antd";
import Alerts from "../../../shared/alerts";
import {
  CheckOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  getGroupsPeriod,
  getGroupPeriodById,
  addStudentsToGroupPeriod,
} from "../../../service/GroupsPeriodService";
import StudentService from "../../../service/StudentService";
import {
  ButtonIcon,
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import { columnProps, defaultColumn } from "../../../shared/columns";
import alerts from "../../../shared/alerts";

const { getStudentsBySchoolCareerSemester } = StudentService;

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: ".5em" },
  },
};

const validations = {
  group_id: [{ required: false, message: "¡El campo es requerido!" }],
};

export default ({ groupPeriodId, isRegular }) => {
  const [loading, setLoading] = useState(true);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [groupPeriodData, setGroupPeriodData] = useState(false);
  const [showFilteredStudents, setShowFilteredStudents] = useState(true);
  const [groupsPeriodData, setGroupsPeriodData] = useState([]);
  const [form] = Form.useForm();
  const periodId = useSelector((store) => store.permissionsReducer.period.id);

  useEffect(() => {
    const setUp = async () => {
      const groupPeriodResponse = await getGroupPeriodById(groupPeriodId);
      if (groupPeriodResponse && groupPeriodResponse.success) {
        setShowFilteredStudents(
          groupPeriodResponse.data.inscripcion_regular_abierta ||
            groupPeriodResponse.data.inscripcion_irregular_abierta
        );
        if (showFilteredStudents) {
          if (groupPeriodResponse.data.semestre > 1) {
            const groupsPeriodResponse = await getGroupsPeriod({
              periodo_id: periodId - 1,
              semestre: groupPeriodResponse.data.semestre - 1,
              plantel_id: groupPeriodResponse.data.plantel_carrera.plantel_id,
              carrera_id: groupPeriodResponse.data.plantel_carrera.carrera_id,
            });
            if (groupsPeriodResponse && groupsPeriodResponse.success) {
              setGroupsPeriodData(
                groupsPeriodResponse.groups.map(
                  ({ id, semestre, grupo, turno }) => ({
                    id,
                    description: `${semestre}${grupo} - ${turno}`,
                  })
                )
              );
              setGroupPeriodData(groupPeriodResponse.data);
            }
          } else {
            const filterStudentsResponse =
              await getStudentsBySchoolCareerSemester({
                plantel_id: groupPeriodResponse.data.plantel_carrera.plantel_id,
                carrera_id: groupPeriodResponse.data.plantel_carrera.carrera_id,
                semestre: groupPeriodResponse.data.semestre - 1,
                inscripcion_grupo: true,
                ...(groupPeriodResponse.data.inscripcion_regular_abierta
                  ? { solo_regulares: true }
                  : { solo_irregulares: true }),
                estatus_inscripcion: "Activo",
              });

            if (filterStudentsResponse && filterStudentsResponse.success) {
              setGroupPeriodData(groupPeriodResponse.data);
              setFilteredStudents(
                filterStudentsResponse.data.map((student) => ({
                  ...student,
                  ...student.usuario,
                  unsaved: true,
                }))
              );
            }
          }
        }
        setRegisteredStudents([
          ...groupPeriodResponse.data.alumnos_irregulares.map((student) => ({
            ...student,
            ...student.usuario,
          })),
          ...groupPeriodResponse.data.alumnos.map((student) => ({
            ...student,
            ...student.usuario,
          })),
        ]);
        setLoading(false);
      }
    };
    setUp();
  }, []);

  const handleAdd = (student) => {
    setRegisteredStudents([student, ...registeredStudents]);
    setFilteredStudents(filteredStudents.filter((s) => s.id !== student.id));
  };

  const handleRemove = (student) => {
    setRegisteredStudents(
      registeredStudents.filter((s) => s.id !== student.id)
    );
    setFilteredStudents([student, ...filteredStudents]);
  };

  const handleOnSave = async () => {
    setLoading(true);
    const data = {};
    data.alumnos = registeredStudents
      .filter((student) => student.unsaved)
      .map((s) => s.id);
    data.grupo_periodo_id = groupPeriodId;
    const response = await addStudentsToGroupPeriod(data);
    if (response && response.success) {
      alerts.success("Listo", "Alumnos registrados con éxito.");
      setRegisteredStudents(
        registeredStudents.map((s) => ({ ...s, unsaved: false }))
      );
    }
    setLoading(false);
  };

  const handleFinish = async () => {
    setLoading(true);
    const filterStudentsResponse = await getStudentsBySchoolCareerSemester({
      plantel_id: groupPeriodData.plantel_carrera.plantel_id,
      carrera_id: groupPeriodData.plantel_carrera.carrera_id,
      semestre: groupPeriodData.semestre - 1,
      grupo_periodo_id: form.getFieldValue().group_id,
      inscripcion_grupo: true,
      ...(groupPeriodData.inscripcion_regular_abierta
        ? { solo_regulares: true }
        : { solo_irregulares: true }),
      estatus_inscripcion: "Activo",
    });
    if (filterStudentsResponse) {
      setFilteredStudents(
        filterStudentsResponse.data.map((student) => ({
          ...student,
          ...student.usuario,
          unsaved: true,
        }))
      );
    }
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  const tableColumns = [
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer apellido", "primer_apellido"),
    defaultColumn("Segundo apellido", "segundo_apellido"),
    defaultColumn("CURP", "username"),
    defaultColumn("Tipo", "tipo_alumno"),
    defaultColumn("Tipo de trayectoria", "tipo_trayectoria"),
  ];

  const filteredStudentsTableColumns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (student) => {
        return (
          student.unsaved && (
            <ButtonIcon
              tooltip="Añadir"
              icon={<CheckOutlined />}
              color="green"
              onClick={() => handleAdd(student)}
              tooltipPlacement="top"
            />
          )
        );
      },
    },
    ...tableColumns,
  ];

  const registeredStudentsTableColumns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (student) => {
        return (
          student.unsaved && (
            <ButtonIcon
              tooltip="Quitar"
              icon={<DeleteOutlined />}
              color="volcano"
              onClick={() => handleRemove(student)}
              tooltipPlacement="top"
            />
          )
        );
      },
    },
    ...tableColumns,
  ];

  return (
    <Loading loading={loading}>
      {groupPeriodData && (
        <>
          <h4>
            {groupPeriodData.semestre}
            {groupPeriodData.grupo} - {groupPeriodData.turno} -{" "}
            {groupPeriodData.periodo.nombre} -{" "}
            {groupPeriodData.plantel_carrera.plantel.nombre}
          </h4>
          {groupPeriodData.fecha_inicio &&
          groupPeriodData.fecha_fin &&
          groupPeriodData.fecha_inicio_irregular &&
          groupPeriodData.fecha_fin_irregular ? (
            <>
              <h5>
                Configuración de inscripciones de alumnos regulares:{" "}
                {groupPeriodData.fecha_inicio} al {groupPeriodData.fecha_fin}
              </h5>
              <h5>
                Configuración de inscripciones de alumnos irregulares:{" "}
                {groupPeriodData.fecha_inicio_irregular} al{" "}
                {groupPeriodData.fecha_fin_irregular}
              </h5>
            </>
          ) : (
            <h5>
              No se han configurado las fechas de inscripción a este grupo
            </h5>
          )}
        </>
      )}
      {groupPeriodData.semestre > 1 ? (
        <>
          <Form
            form={form}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            layout="vertical"
          >
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Grupos"
                  name="group_id"
                  rules={validations.group_id}
                >
                  <SearchSelect dataset={groupsPeriodData} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}></Col>
            </Row>
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <PrimaryButton loading={loading} icon={<SearchOutlined />}>
                  Buscar
                </PrimaryButton>
              </Col>
            </Row>
          </Form>
        </>
      ) : (
        false
      )}
      <hr></hr>
      <h5>Alumnos sin inscribirse</h5>
      {showFilteredStudents && (
        <>
          <p style={{ marginTop: "2em" }}>
            <strong>Registros encontrados: </strong> {filteredStudents.length}
          </p>
          <Table
            rowKey="id"
            bordered
            pagination={{ position: ["topLeft", "bottomLeft"] }}
            columns={filteredStudentsTableColumns}
            scroll={{ x: tableColumns.length * 200 }}
            dataSource={filteredStudents}
            size="small"
          />
          <p style={{ marginTop: "2em" }}>
            <strong>Registros encontrados: </strong> {filteredStudents.length}
          </p>
        </>
      )}
      <hr />
      <h5>Alumnos inscritos</h5>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {registeredStudents.length}
      </p>
      <Table
        rowKey="usuario_id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={registeredStudentsTableColumns}
        scroll={{ x: tableColumns.length * 200 }}
        dataSource={registeredStudents}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {registeredStudents.length}
      </p>
      <PrimaryButton
        size="large"
        loading={loading}
        icon={<CheckCircleOutlined />}
        onClick={handleOnSave}
      >
        Guardar
      </PrimaryButton>
    </Loading>
  );
};
