import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Row, Col, InputNumber, Modal, Select, Option } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { PrimaryButton, SearchSelect, SearchInputSelect, Loading } from "../../../shared/components";
import CatalogService from "../../../service/CatalogService";
import StudentService from "../../../service/StudentService";
import { getGroupsPeriod } from "../../../service/GroupsPeriodService";
import { getFilteredTeachersByUac, getFilteredTeachers } from "../../../service/TeacherService";
import alerts from "../../../shared/alerts";
import {
  getSemesterByPeriod,
  PermissionValidatorFn,
} from "../../../shared/functions";
import { async } from "q";

const {
  getCareerCatalogs,
  getSchoolCatalogs,
  getPeriodsCatalog,
  getUacWithOutGrades,
} = CatalogService;

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 12 },
  },
  colNumberProps: {
    xs: { span: 24 },
    md: { span: 12 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};

const validations = {
  /* asignatura add */
  semester_id: [{ required: true, message: "¡El semestre es requerido!" }],
  carrera_uac_id: [{ required: true, message: "¡La UAC es requerida!" }],
  grupo_id: [{ required: true, message: "¡El grupo es requerido!" }],
  carrera_id: [{ required: true, message: "¡La carrera es requerida!" }],
  periodo_id: [{ required: true, message: "¡El periodo es requerido!" }],
  plantel_id: [{ required: true, message: "¡El plantel es requerido!" }],
  docente_id: [{ required: true, message: "¡El docente es requerido!" }],
};

export default ({ dataStudent, idStudent, carreraId, onSave }) => {
  const [docente, setDocente] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [semesterSelected, setSemesterSelected] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [schools, setSchools] = useState([]);
  const [careers, setCareers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [typeGradeSelected, setTypeGradeSelected] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [partials, setPartials] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const primaryColor = "#9d2449";

  const tiposCalificacion = [
    {
      description: "ORDINARIA",
      id: 1
    },
    {
      description: "RS",
      id: 2
    },
    {
      description: "CI",
      id: 3
    },
    {
      description: "EXT",
      id: 4
    },
  ];

  const setUp = async () => {
    setLoading(true);
    const schoolsCatalog = await getSchoolCatalogs(dataStudent.plantel.municipio.estado_id);
    if (schoolsCatalog && schoolsCatalog.success) {
      form.setFieldsValue({ plantel_id: null, carrera_id: null, periodo_id: null, semester_id: null, grupo_id: null, carrera_uac_id: null });
      setCareers([]);
      setPeriods([]);
      setSemesters([]);
      setGrupos([]);
      setSubjects([]);
      setSchools(
        schoolsCatalog.schools.map(({ id, description1, description2 }) => ({
          id,
          description: `${description1} - ${description2}`,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, []);

  const handleOk = () => {
    form.submit();
  }

  const handleModal = () => {
    setIsVisible(true);
  }

  const handleOnCancel = () => {
    setLoading(true);
    form.setFieldsValue({
      carrera_id: null,
      periodo_id: null,
      semester_id: null,
      grupo_id: null,
      plantel_id: null,
      carrera_uac_id: null,
      docente_id: null,
      parcial_1: null,
      faltas_parcial_1: null,
      parcial_2: null,
      faltas_parcial_2: null,
      parcial_3: null,
      faltas_parcial_3: null,
    });
    setCareers([]);
    setPeriods([]);
    setSemesters([]);
    setGrupos([]);
    setSubjects([]);
    setTeachers([]);
    setDocente(false);
    setPartials(false);
    setIsVisible(false);
    setTypeGradeSelected(0);
    setLoading(false);
  }

  const handleSearchTeacher = async (value) => {
    setLoading(true);
    if (value.length >= 3) {
      const response = await getFilteredTeachers({
        plantel_id: form.getFieldsValue().plantel_id,
        input: value
      });
      if (response && response.success) {
        if (response.teachers) {
          const data = response.teachers.map((e) => {
            return {
              description: `${e.nombre} ${e.primer_apellido} ${e.segundo_apellido}`,
              id: e.id
            }
          })
          setTeachers(data);
        }
      }
    }
    setLoading(false);
  };

  const handleOnSemesterChange = async (values) => {
    setLoading(true);
    form.setFieldsValue({
      grupo_id: null,
      carrera_uac_id: null,
      docente_id: null,
      parcial_1: null,
      faltas_parcial_1: null,
      parcial_2: null,
      faltas_parcial_2: null,
      parcial_3: null,
      faltas_parcial_3: null,
    });
    setGrupos([]);
    setSubjects([]);
    setTeachers([]);
    setTypeGradeSelected(0);
    setDocente(false);
    setSemesterSelected(values);
    const response = await getGroupsPeriod({
      stateId: dataStudent.plantel.municipio.estado_id,
      plantel_id: form.getFieldsValue().plantel_id,
      carrera_id: form.getFieldsValue().carrera_id,
      periodo_id: form.getFieldsValue().periodo_id,
      semestre: form.getFieldsValue().semester_id,
    });
    if (response && response.success) {
      const data = response.groups.map((e) => {
        return {
          description: `${e.grupo} - ${e.turno}`,
          id: e.id
        }
      });
      setGrupos(data);
    }
    setLoading(false);
  }

  const handleOnPeriodsChange = async (periodId) => {
    setLoading(true);
    form.setFieldsValue({
      semester_id: null,
      grupo_id: null,
      carrera_uac_id: null,
      docente_id: null,
      parcial_1: null,
      faltas_parcial_1: null,
      parcial_2: null,
      faltas_parcial_2: null,
      parcial_3: null,
      faltas_parcial_3: null,
    });
    setSemesters([]);
    setGrupos([]);
    setSubjects([]);
    setTeachers([]);
    setTypeGradeSelected(0);
    setDocente(false);
    if (periodId) {
      const currentPeriod = periods.filter((p) => p.id === periodId)[0].name;
      setSemesters(
        getSemesterByPeriod(parseInt(currentPeriod.split("").pop()))
      );
    } else {
      setSemesters([]);
    }
    setLoading(false);
  };

  const handleOnSchoolChange = async (schoolId) => {
    setLoading(true);
    form.setFieldsValue({
      carrera_id: null,
      periodo_id: null,
      semester_id: null,
      grupo_id: null,
      carrera_uac_id: null,
      docente_id: null,
      parcial_1: null,
      faltas_parcial_1: null,
      parcial_2: null,
      faltas_parcial_2: null,
      parcial_3: null,
      faltas_parcial_3: null,
    });
    setCareers([]);
    setPeriods([]);
    setSemesters([]);
    setGrupos([]);
    setSubjects([]);
    setTeachers([]);
    setTypeGradeSelected(0);
    setDocente(false);
    const careersCatalog = await getCareerCatalogs(schoolId);
    if (careersCatalog) {
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

  const handleOnSubjectsChange = async (values) => {
    setLoading(true);
    form.setFieldsValue({
      parcial_1: null,
      faltas_parcial_1: null,
      parcial_2: null,
      faltas_parcial_2: null,
      parcial_3: null,
      faltas_parcial_3: null,
    });
    setTypeGradeSelected(0);
    setTeachers([]);
    setDocente(true);
    setLoading(false);
  }

  const handleOnTeachersChange = () => {
    setLoading(true);
    setTypeGradeSelected(1);
    setPartials(true);
    setLoading(false);
  }

  const handleFinish = async (values) => {
    setLoading(true);
    if (values.parcial_1 !== null || values.parcial_2 !== null || values.parcial_3 !== null) {
      const parciales = [];
      if (values.parcial_1 !== null) parciales.push({ parcial: 1, calificacion: values.parcial_1, faltas: values.faltas_parcial_1 });
      if (values.parcial_2 !== null) parciales.push({ parcial: 2, calificacion: values.parcial_2, faltas: values.faltas_parcial_2 });
      if (values.parcial_3 !== null) parciales.push({ parcial: 3, calificacion: values.parcial_3, faltas: values.faltas_parcial_3 });
      const response = await StudentService.addSubjectAcademicRecord(idStudent, {
        stateId: dataStudent.plantel.municipio.estado_id,
        plantel_id: form.getFieldsValue().plantel_id,
        carrera_id: form.getFieldsValue().carrera_id,
        periodo_id: form.getFieldsValue().periodo_id,
        semestre: form.getFieldsValue().semester_id,
        carrera_uac_id: form.getFieldsValue().carrera_uac_id,
        grupo_periodo_id: form.getFieldsValue().grupo_id,
        docente_id: form.getFieldsValue().docente_id,
        tipo_calificacion: "N",
        calificaciones: parciales
      });
      if (response && response.success) {
        alerts.success(response.data.message);
        await onSave();
        handleOnCancel();
      }
    } else {
      alerts.warning("Ingrese al menos una calificación parcial");
    }
    setLoading(false);
  }

  const handleOnCareerChange = async () => {
    setLoading(true);
    form.setFieldsValue({
      periodo_id: null,
      semester_id: null,
      grupo_id: null,
      carrera_uac_id: null,
      docente_id: null,
      parcial_1: null,
      faltas_parcial_1: null,
      parcial_2: null,
      faltas_parcial_2: null,
      parcial_3: null,
      faltas_parcial_3: null,
    });
    setPeriods([]);
    setSemesters([]);
    setGrupos([]);
    setSubjects([]);
    setTeachers([]);
    setTypeGradeSelected(0);
    setDocente(false);
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
    setLoading(false);
  };

  const handleOnGroupChange = async () => {
    setLoading(true);
    form.setFieldsValue({
      carrera_uac_id: null,
      docente_id: null,
      parcial_1: null,
      faltas_parcial_1: null,
      parcial_2: null,
      faltas_parcial_2: null,
      parcial_3: null,
      faltas_parcial_3: null,
    });
    setSubjects([]);
    setTeachers([]);
    setTypeGradeSelected(0);
    setDocente(false);
    const response = await getUacWithOutGrades({ alumno_id: idStudent, semestre: semesterSelected, carrera_id: form.getFieldsValue().carrera_id, });
    if (response && response.success) {
      const data = response.type.map(({ id, uac }) => {
        return {
          id,
          description: `${uac?.clave_uac} - ${uac?.nombre}`
        }
      });
      setSubjects(data);
    }
    setLoading(false);
  }

  const handleFinishFailed = async () => {
  }

  return (
    <>
      <PrimaryButton icon={<FileAddOutlined />} size="large" fullWidth={true} onClick={handleModal}>
        Agregar asignatura
      </PrimaryButton>
      <Modal
        visible={isVisible}
        title="Agregar asignatura"
        onOk={handleOk}
        onCancel={handleOnCancel}
        width={1000}
        confirmLoading={loading}
        okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}
      >
        <Loading loading={loading}>
          <Form
            form={form}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            layout="vertical"
          >
            <Row {...styles.rowProps}>
              {/* <Col {...styles.colProps}>
              <Form.Item
                label="Tipo calificación"
                name="tipo_calificacion"
                rules={validations.tipo_calificacion}
              >
                <SearchSelect
                  dataset={tiposCalificacion}
                  disabled={!tiposCalificacion.length}
                  onChange={handleOnChangeTypeGrades}
                />
              </Form.Item>
            </Col> */}
              <Col {...styles.colProps}>
                <Form.Item
                  label="Plantel"
                  name="plantel_id"
                  rules={validations.plantel_id}
                >
                  <SearchSelect
                    dataset={schools}
                    disabled={!schools.length}
                    onChange={handleOnSchoolChange}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item label="Carrera" name="carrera_id" rules={validations.carrera_id}>
                  <SearchSelect dataset={careers} disabled={!careers.length} onChange={handleOnCareerChange} />
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
                    dataset={grupos}
                    disabled={!grupos.length}
                    onChange={handleOnGroupChange}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Asignatura"
                  name="carrera_uac_id"
                  rules={validations.carrera_uac_id}
                >
                  <SearchSelect
                    dataset={subjects}
                    disabled={!subjects.length}
                    onChange={handleOnSubjectsChange}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Docente"
                  name="docente_id"
                  rules={validations.docente_id}
                >
                  <SearchInputSelect
                    disabled={!docente}
                    placeholder="Nombre/CURP empleado"
                    onSearch={handleSearchTeacher}
                    onChange={handleOnTeachersChange}
                    dataset={teachers}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row {...styles.rowProps}>
              {typeGradeSelected === 1 ? (
                <>
                  <Col {...styles.colNumberProps}>
                    <Form.Item
                      label="Parcial 1"
                      name="parcial_1"
                    >
                      <InputNumber
                        style={{ width: "90%" }}
                        step={0.1}
                        min={0}
                        max={10}
                        disabled={!partials}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...styles.colNumberProps}>
                    <Form.Item
                      label="Faltas"
                      name="faltas_parcial_1"
                    >
                      <InputNumber
                        style={{ width: "90%" }}
                        step={1}
                        min={0}
                        disabled={!partials}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...styles.colNumberProps}>
                    <Form.Item
                      label="Parcial 2"
                      name="parcial_2"
                    >
                      <InputNumber
                        style={{ width: "90%" }}
                        step={0.1}
                        min={0}
                        max={10}
                        disabled={!partials}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...styles.colNumberProps}>
                    <Form.Item
                      label="Faltas"
                      name="faltas_parcial_2"
                    >
                      <InputNumber
                        style={{ width: "90%" }}
                        step={1}
                        min={0}
                        disabled={!partials}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...styles.colNumberProps}>
                    <Form.Item
                      label="Parcial 3"
                      name="parcial_3"
                    >
                      <InputNumber
                        style={{ width: "90%" }}
                        step={0.1}
                        min={0}
                        max={10}
                        disabled={!partials}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...styles.colNumberProps}>
                    <Form.Item
                      label="Faltas"
                      name="faltas_parcial_3"
                    >
                      <InputNumber
                        style={{ width: "90%" }}
                        step={1}
                        min={0}
                        disabled={!partials}
                      />
                    </Form.Item>
                  </Col>
                </>
              ) : null}
              {
                typeGradeSelected === 4 ? (
                  <Col {...styles.colNumberProps}>
                    <Form.Item
                      label="Extraordinario"
                      name="extraordinario"
                    >
                      <InputNumber
                        style={{ width: "90%" }}
                        step={0.1}
                        min={0}
                        max={10}
                        disabled={true}
                      /* disabled={!partials} */
                      />
                    </Form.Item>
                  </Col>
                ) : null
              }
              {
                typeGradeSelected === 3 ? (
                  <Col {...styles.colNumberProps}>
                    <Form.Item
                      label="Curso intersemestral"
                      name="curso_intersemestral"
                    >
                      <InputNumber
                        style={{ width: "90%" }}
                        step={0.1}
                        min={0}
                        max={10}
                        /* disabled={!partials} */
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>) : null
              }
              {
                typeGradeSelected === 2 ? (
                  <Col {...styles.colNumberProps}>
                    <Form.Item
                      label="Recursamiento semestral"
                      name="recursamiento_semestral"
                    >
                      <InputNumber
                        style={{ width: "90%" }}
                        step={0.1}
                        min={0}
                        max={10}
                        /* disabled={!partials} */
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                ) : null
              }
            </Row>
          </Form>
        </Loading>
      </Modal>
    </>
  );
};
