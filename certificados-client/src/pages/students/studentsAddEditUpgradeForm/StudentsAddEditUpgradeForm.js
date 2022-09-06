import React, { useEffect, useState } from "react";
import {
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import useStudentsAddEditUpgradeForm from "./useStudentsAddEditUpgradeForm";
import { Alert, Col, DatePicker, Form, Input, InputNumber, Row } from "antd";
import {
  EstatusInscripcionCombo,
  StudentCareerChange,
  StudentsAllowGroupEnrollment,
  StudentsEnrollmentTypes,
  StudentsStatuses,
} from "../../../shared/catalogs";
import CatalogService from "../../../service/CatalogService";
import PermissionValidator from "../../../components/PermissionValidator";
import { bloodTypes, permissionList, sexEnum } from "../../../shared/constants";
import CountriesSelect from "../../../components/CountriesSelect";
import StudentTutors from "../StudentTutors";
import StudentsAddEditFormCaptureGrades from "../StudentsAddEditFormCaptureGrades";
import StudentsAddEditFormCaptureGradesUac from "../StudentsAddEditFormCaptureGradesUac";
import EditRevalidationGrades from "../studentsEdit/EditRevalidationGrades";
import { CheckCircleOutlined } from "@ant-design/icons";
import { validateCurp, validateCurpExtranjero } from "../../../shared/functions";
import InputPhoto from "../../../components/InputPhoto";
import { async } from "q";

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};
const validations = {
  required: [
    {
      required: true,
      message: "Este campo es requerido",
    },
  ],
  email: [
    {
      required: true,
      type: "email",
      message: "¡Ingresa un correo válido!",
    },
  ],
  curp: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurp(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP correcta!");
      },
    },
  ],
  curpExtranjero: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurpExtranjero(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP extranjera de 10 dígitos!");
      },
    },
  ],
};

const StudentsAddEditUpgradeForm = ({
  studentCurp = undefined,
  applicantId = undefined,
}) => {
  const [generations, setGeneratios] = useState([]);
  const [
    {
      loading,
      form,
      handleOnFinish,
      handleOnFinishFailed,
      handleOnEnrollmentTypeChange,
      studentsTypesFiltered,
      handleOnTrayectoryChange,
      studentsTrajectoryFiltered,
      states,
      handleOnStateChange,
      schools,
      handleOnSchoolChange,
      careers,
      handleOnCareerChange,
      semestersFiltered,
      handleOnSemesterChange,
      documents,
      handleCountryBirthChange,
      bornCountry,
      allStates,
      handleAllStatesChange,
      cities,
      loadingCities,
      medInstitutions,
      currentStudentData,
      handleTutorsChange,
      cambioSubsistema,
      handleOnGradesChange,
      currentSemester,
      handleOnGradesUacChnage,
      studentPhoto,
      handlePhotoChange,
    },
  ] = useStudentsAddEditUpgradeForm({ studentCurp, applicantId });

  useEffect(() => {
    handleSetGenerations();
  }, []);

  const handleSetGenerations = async () => {
    const respondeGenerations = await CatalogService.getGenerationsCatalogs();
    if(respondeGenerations && respondeGenerations.success) {
      setGeneratios(respondeGenerations.generations);
    }
  }

  return (
    <Loading loading={loading}>
      <Form
        form={form}
        onFinish={handleOnFinish}
        onFinishFailed={handleOnFinishFailed}
        layout="vertical"
      >
        <fieldset>
          <legend>Datos administrativos</legend>
          <Row {...styles.rowProps}>
            {!studentCurp && (
              <Col {...styles.colProps}>
                <Form.Item
                  label="Tipo inscripción"
                  name="tipo_inscripcion"
                  rules={validations.required}
                >
                  <SearchSelect
                    /* disabled={!!applicantId} */
                    onChange={handleOnEnrollmentTypeChange}
                    dataset={StudentsEnrollmentTypes.map((s) => ({
                      id: s,
                      description: s,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}
            <Col {...styles.colProps}>
              <Form.Item
                label="Tipo alumno"
                name="tipo_alumno"
                rules={validations.required}
              >
                <SearchSelect
                  dataset={studentsTypesFiltered}
                  /* disabled={!!applicantId} */
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Tipo Trayectoria"
                name="tipo_trayectoria"
                rules={validations.required}
              >
                <SearchSelect
                  onChange={handleOnTrayectoryChange}
                  dataset={studentsTrajectoryFiltered}
                  /* disabled={!!applicantId} */
                />
              </Form.Item>
            </Col>
            {!studentCurp && (
              <Col {...styles.colProps}>
                <Form.Item
                  label="Año de ingreso"
                  name="anio_ingreso"
                  rules={validations.required}
                >
                  <DatePicker picker="year" style={{ width: "90%" }} />
                </Form.Item>
              </Col>
            )}
            <Col {...styles.colProps}>
              <Form.Item
                label="Permitir inscripción a un grupo"
                name="permitir_inscripcion"
                rules={validations.required}
              >
                <SearchSelect
                  dataset={StudentsAllowGroupEnrollment.map((e) => ({
                    id: e,
                    description: e,
                  }))}
                />
              </Form.Item>
            </Col>
            {studentCurp && (
              <Col {...styles.colProps}>
                <Form.Item
                  label="Es cambio de carrera"
                  name="cambio_carrera"
                  rules={validations.required}
                >
                  <SearchSelect
                    dataset={StudentCareerChange.map((e) => ({
                      id: e,
                      description: e,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}
            {studentCurp && (
              <Col {...styles.colProps}>
                <Form.Item
                  label="Estatus de la inscripción"
                  name="estatus_inscripcion"
                  rules={validations.required}
                >
                  <SearchSelect
                    dataset={EstatusInscripcionCombo.map((s) => ({
                      id: s,
                      description: s,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}
            <Col {...styles.colProps}>
              <Form.Item label="Periodo inicio" name="periodo_inicio">
                <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Periodo fin" name="periodo_termino">
                <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Generación" name="generacion">
                <SearchSelect dataset={generations} />
              </Form.Item>
            </Col>
          </Row>
        </fieldset>
        <fieldset>
          <legend>Datos de la institución</legend>
          <Row {...styles.rowProps}>
            <PermissionValidator
              permissions={[permissionList.NACIONAL, permissionList.ESTATAL]}
              allPermissions={false}
            >
              <Col {...styles.colProps}>
                <Form.Item
                  label="Estado"
                  name="estado_id"
                  rules={validations.required}
                >
                  <SearchSelect
                    dataset={states}
                    disabled={!states.length || !!applicantId}
                    onChange={handleOnStateChange}
                  />
                </Form.Item>
              </Col>
            </PermissionValidator>
            <Col {...styles.colProps}>
              <Form.Item
                label="Plantel"
                name="plantel_id"
                rules={validations.required}
              >
                <SearchSelect
                  dataset={schools}
                  disabled={!schools.length || !!applicantId}
                  onChange={handleOnSchoolChange}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Carrera"
                name="carrera_id"
                rules={validations.required}
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
                label="Semestre"
                name="semestre"
                rules={validations.required}
              >
                <SearchSelect
                  dataset={semestersFiltered}
                  onChange={handleOnSemesterChange}
                  /* disabled={!!applicantId} */
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Matrícula"
                name="matricula"
                rules={!!studentCurp ? validations.required : undefined}
              >
                <Input style={{ width: "90%" }} placeholder="Matrícula" />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Documentos" name="documentos">
                <SearchSelect dataset={documents} mode="multiple" />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Estatus de documentación"
                name="estatus"
                rules={validations.required}
              >
                <SearchSelect
                  dataset={StudentsStatuses.map((s) => ({
                    id: s,
                    description: s,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </fieldset>
        <fieldset>
          <legend>Datos personales del alumno</legend>
          {bornCountry && bornCountry !== "Mexico" && (
            <Alert
              message={<strong>Atención</strong>}
              description={
                <>
                  <p>
                    Para los estudiantes extranjeros que no cuenten con CURP se les debe de ingresar una de 10 dígitos
                  </p>
                </>
              }
              type="warning"
              showIcon
            />
          )}<br />
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item
                label="Nombre"
                name="nombre"
                rules={validations.required}
              >
                <Input
                  style={{ width: "90%" }}
                  placeholder="Nombre(s) del alumno"
                  /* disabled={!!applicantId} */
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Primer Apellido"
                name="primer_apellido"
                rules={validations.required}
              >
                <Input
                  style={{ width: "90%" }}
                  placeholder="Primer apellido"
                  /* disabled={!!applicantId} */
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Segundo Apellido" name="segundo_apellido">
                <Input
                  style={{ width: "90%" }}
                  placeholder="Segundo apellido"
                  /* disabled={!!applicantId} */
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="País de nacimiento"
                name="pais_nacimiento"
                rules={validations.required}
              >
                <CountriesSelect onChange={handleCountryBirthChange} />
              </Form.Item>
            </Col>
            {bornCountry === "Mexico" && (
              <>
                <Col {...styles.colProps}>
                  <Form.Item
                    label="Estado de nacimiento"
                    name="estado_nacimiento_id"
                  >
                    <SearchSelect
                      dataset={allStates}
                      onChange={handleAllStatesChange}
                    />
                  </Form.Item>
                </Col>
                <Col {...styles.colProps}>
                  <Form.Item
                    label="Municipio de nacimiento"
                    name="municipio_nacimiento_id"
                  >
                    <SearchSelect
                      dataset={cities}
                      disabled={loadingCities || !cities.length}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col {...styles.colProps}>
              <Form.Item
                label="Código postal del lugar de nacimiento"
                name="codigo_postal_nacimiento"
              >
                <Input placeholder="Código postal" style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Fecha de nacimiento" name="fecha_nacimiento">
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "90%" }}
                  /* disabled={!!applicantId} */
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="CURP"
                name="curp"
                rules={
                  !studentCurp && bornCountry !== "Mexico"
                    ? validations.curpExtranjero
                    : validations.curp
                }
              >
                <Input
                  style={{ width: "90%" }}
                  placeholder="CURP"
                  /* disabled={!!applicantId} */
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Sexo" name="genero">
                <SearchSelect dataset={sexEnum} />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Correo Electrónico"
                name="email"
                rules={validations.email}
              >
                <Input
                  style={{ width: "90%" }}
                  placeholder="Correo electrónico institucional"
                  maxLength={100}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Teléfono de contacto" name="numero_contacto">
                <Input style={{ width: "90%" }} placeholder="Teléfono fijo" />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Teléfono móvil" name="numero_movil">
                <Input
                  style={{ width: "90%" }}
                  placeholder="Teléfono celular"
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Dirección"
                name="direccion"
                rules={validations.required}
              >
                <Input style={{ width: "90%" }} placeholder="Dirección" />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Código Postal"
                name="codigo_postal"
                rules={validations.required}
              >
                <InputNumber
                  style={{ width: "90%" }}
                  placeholder="Código postal"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Fotografía del alumno" name="fotografia">
                <InputPhoto
                  onChange={handlePhotoChange}
                  photo={studentPhoto}
                  name="fotografia"
                />
              </Form.Item>
            </Col>
          </Row>
        </fieldset>
        <fieldset>
          <legend>Datos médicos</legend>
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item label="Institución Médica" name="institucion_nss">
                <SearchSelect
                  dataset={medInstitutions.map(({ id, siglas, nombre }) => ({
                    id,
                    description: `${siglas} - ${nombre}`,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Número de Seguro Social" name="nss">
                <Input
                  style={{ width: "90%" }}
                  placeholder="Número de Seguro Social"
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Tipo de sangre" name="tipo_sangre">
                <SearchSelect
                  dataset={bloodTypes.map((blood) => ({
                    id: blood,
                    description: blood,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </fieldset>
        <fieldset>
          <legend>Datos de tutor(es)</legend>
          <StudentTutors
            tutors={currentStudentData?.tutores}
            loading={loading}
            onTutorsChange={handleTutorsChange}
          />
        </fieldset>
        {/*
            Si es edición (studentCurp!=undefined) se calcula si se muestra la captura de calificaciones.
          */}
        {!studentCurp &&
          (!!cambioSubsistema ? (
            <StudentsAddEditFormCaptureGrades
              onGradesChange={handleOnGradesChange}
            />
          ) : (
            currentSemester !== 1 &&
            currentSemester !== undefined && (
              <StudentsAddEditFormCaptureGradesUac
                onGradesUacChange={handleOnGradesUacChnage}
              />
            )
          ))}
        {!!studentCurp && currentStudentData?.usuario_id && !!cambioSubsistema && (
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <EditRevalidationGrades
                studentId={currentStudentData?.usuario_id}
              />
            </Col>
          </Row>
        )}
        <PrimaryButton
          size="large"
          loading={loading}
          icon={<CheckCircleOutlined />}
        >
          Guardar
        </PrimaryButton>
      </Form>
    </Loading>
  );
};

export default StudentsAddEditUpgradeForm;
