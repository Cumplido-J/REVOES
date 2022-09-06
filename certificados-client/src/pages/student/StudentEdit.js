import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Tabs, Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { PageLoading, Title, ButtonCustom } from "../../shared/components";
import StudentService from "../../service/StudentService";
import StudentForm from "./StudentForm";
import alerts from "../../shared/alerts";
import StudentEditPasswordForm from "./StudentEditPasswordForm";
import StudentSubjects from "./StudentSubjects";
import StudentModules from "./StudentModules";
import { userHasRole } from "../../shared/functions";
import StudentCertificate from "./StudentCertificate";
import StudentCertificateType from "./StudentCertificateType";
import CertificateService from "../../service/CertificateService";
import StudenInfo from "./StudenInfo";
import StudentCertificateAbrogrado from "./StudentCertificateAbrogrado";
import StudentDegree from "./StudentDegree";
import StudentSetting from "./StudentSetting";
import StudentRecord from "./StudentRecord/StudentRecord";

const serchCertificateLimit = async (curp) => {
  const response = await CertificateService.getCertificateLimit(curp);
  if (!response.success) return;
  if (response.message.certificateTypeId === 1 && (response.message.status === "CERTIFICADO" || response.message.status === "VALIDADO" || response.message.status === "EN PROCESO")) return true;
  else return false;
};

const serchCertificateLimit2 = async (curp) => {
  const response = await CertificateService.getCertificateLimit(curp);
  if (!response.success) return;
  if (response.message.certificateTypeId === 2 && (response.message.status === "CERTIFICADO" || response.message.status === "VALIDADO" || response.message.status === "EN PROCESO")) return true;
  else return false;
};

const serchCertificateLimit3 = async (curp) => {
  const response = await CertificateService.getCertificateLimit(curp);
  if (!response.success) return;

  if (response.message.certificateTypeId === 3 && (response.message.status === "CERTIFICADO" || response.message.status === "VALIDADO" || response.message.status === "EN PROCESO")) return true;
  else return false;
};

const getSubjectsCertificateFinal = async (curp) => {
  const response = await CertificateService.getStudentData(curp);
  if (!response.success) return;
  const hasSubjects = response.studentData.modules.filter((subject) => subject.score !== 0).length ===
    response.studentData.modules.filter((subject) => subject).length && response.studentData.finalScore > 0;
  if (!hasSubjects) return false;
  else return true;
};

export default function StudentEdit(props) {
  const { curp } = props.match.params;
  const { userProfile } = props;
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(true);

  const [certificate, setCertificate] = useState([]);
  const [certificateParcial, setCertificateParcial] = useState(false);
  const [certificatePortabilidad, setCertificatePortabilidad] = useState(false);
  const [certificateFinal, setCertificateFinal] = useState(false);
  const [modalFielVisible, setModalFielVisible] = useState(false);
  const [certificateAbrogado, setCertificateAbrogrado] = useState(false);

  useEffect(() => {

    const getStudentData = async () => {
      const response = await StudentService.getStudentData(curp);

      const datos = {
        curp: response.studentData.curp,
        name: response.studentData.name,
        firstLastName: response.studentData.firstLastName,
        secondLastName: response.studentData.secondLastName,
        email: response.studentData.email,
        enrollmentKey: response.studentData.enrollmentKey,
        stateId: response.studentData.stateId,
        schoolId: response.studentData.schoolId,
        careerId: response.studentData.careerId,
        generation: response.studentData.generation,
        enrollmentStartDate: Date.parse(response.studentData.enrollmentStartDate) ? moment(response.studentData.enrollmentStartDate).utc().format('YYYY-MM-DD') : '',
        enrollmentEndDate: Date.parse(response.studentData.enrollmentEndDate) ? moment(response.studentData.enrollmentEndDate).utc().format('YYYY-MM-DD') : '',
        studentStatusId: response.studentData.studentStatusId,
        isPortability: response.studentData.isPortability,
        partialCertificate: response.studentData.partialCertificate,
        abrogadoCertificate: response.studentData.abrogadoCertificate,
        statusSchool:response.studentData.statusSchool,
      };
      setStudentData(datos);
      setLoading(false);
      //console.log(await serchCertificateLimit(curp))
      const responseV1 = await serchCertificateLimit(curp);
      const responseV2 = await serchCertificateLimit2(curp);
      const responseV3 = await serchCertificateLimit3(curp);
      console.log(response.studentData.abrogadoCertificate)
      setCertificate({
        'parcial': (response.studentData.partialCertificate && responseV2) ? true : false,
        'portabilidad': (response.studentData.isPortability && responseV1) ? true : false,
        'final':
          (await getSubjectsCertificateFinal(curp) && !response.studentData.isPortability) && responseV1 ? true : false,
        'abrogado': (response.studentData.abrogadoCertificate && responseV3) ? true : false
      });
    };
    getStudentData();
  }, [curp]);

  const editStudent = async (form) => {
    const response = await StudentService.editStudent(curp, form);
    if (!response.success) return;
    alerts.success("Alumno guardado", "Alumno actualizado correctamente");
    props.history.push(`/Alumnos/Editar/${response.studentData.curp}`);
  };
  const editStudentPassword = async (form) => {
    const response = await StudentService.editStudentPassword(curp, form);
    if (!response.success) return;
    alerts.success(
      "Contraseña guardada",
      "Contraseña actualizada correctamente"
    );
  };

  const editStudentModules = async (form) => {
    const response = await StudentService.editStudentModules(curp, form);
    if (!response.success) return;
    alerts.success(
      "Alumno actualizado",
      "Las calificaciones han sido guardadas correctamente"
    );
    props.history.push(`/Alumnos/Editar/${curp}`);
  };

  const toggleModalFiel = () => {
    setModalFielVisible(!modalFielVisible);
  };




  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/Alumnos/" style={{ color: "black" }}>
            <span>Lista de alumnos</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Editar alumno</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Editar alumno</Title>
        </Col>
      </Row>
      <PageLoading loading={loading}>
        {studentData.curp && (
          <>
            <StudenInfo>
              <Row align="center">
                <div style={{ width: "40%" }}>
                  <ButtonCustom
                    tooltip="Tipo de certificado"
                    color="gold"

                    onClick={toggleModalFiel}
                    loading={loading}
                    icon={<CheckCircleOutlined />}

                  >
                    Selecciona el tipo de certificado
                  </ButtonCustom>
                </div>
              </Row>
            </StudenInfo>
            <p></p>
            <Tabs defaultActiveKey="1" type="card">
              {userHasRole.dev(userProfile.roles) && (
                <Tabs.TabPane tab="Ajustes" key={3} >
                  <StudentSetting {...props} loading={true}  />
                </Tabs.TabPane>
              )}
              <Tabs.TabPane tab="Información del alumno" key="1">
                <StudentForm
                  {...props}
                  studentData={studentData}
                  onSubmit={editStudent}
                />
              </Tabs.TabPane>
              {(userHasRole.schoolControl(userProfile.roles) ||
                userHasRole.certificationAdmin(userProfile.roles) ||
                userHasRole.dev(userProfile.roles)) && (
                  <>
                    {((certificate.parcial && (certificate.portabilidad === false || certificate.final === false)) || certificateParcial) && (
                      <Tabs.TabPane
                        tab="Certificado Parcial - Calificaciones"
                        key="2"
                      >
                        <StudentSubjects {...props} curp={curp} />
                      </Tabs.TabPane>
                    )}
                    {/* <Tabs.TabPane tab="Módulos" key="3">
                    <StudentModules
                      {...props}
                      curp={curp}
                      editStudentModules={editStudentModules}
                    />
                  </Tabs.TabPane> */}
                    {((certificate.portabilidad && certificate.final === false) || certificatePortabilidad) && (
                      <Tabs.TabPane
                        tab="Certificado portabilidad o libre transito"
                        key="4"
                      >
                        <StudentModules
                          {...props}
                          curp={curp}
                          editStudentModules={editStudentModules}
                        />
                      </Tabs.TabPane>
                    )}
                    {((certificate.final && certificate.portabilidad === false) || certificateFinal) && (
                      <Tabs.TabPane
                        tab="Certificado termino"
                        key="6"
                      >
                        <StudentCertificate
                          curp={curp}
                          editable={true}

                        />
                      </Tabs.TabPane>
                    )}

                  </>
                )}
              {((certificate.abrogado && certificate.portabilidad === false && certificate.final === false) || certificateAbrogado) && (
                <Tabs.TabPane tab="Certificado abrogado" key="9">
                  <StudentCertificateAbrogrado
                    curp={curp}
                    editable={true}
                  />

                </Tabs.TabPane>
              )}
              {(
                userHasRole.certificationAdmin(userProfile.roles) ||
                userHasRole.schoolControl(userProfile.roles) ||
                userHasRole.titulacionAdmin(userProfile.roles) ||
                userHasRole.dev(userProfile.roles)) && (
                  <Tabs.TabPane tab="Titulación - Datos Generales" key="10" >
                    <StudentDegree {...props} curp={curp} />
                  </Tabs.TabPane>
                )}
              {(userHasRole.tracingAdmin(userProfile.roles) ||
                userHasRole.dev(userProfile.roles)) && (
                  <Tabs.TabPane tab="Cambiar contraseña" key="5">
                    <StudentEditPasswordForm
                      {...props}
                      onSubmit={editStudentPassword}
                    />
                  </Tabs.TabPane>
                )}
              {(userHasRole.certificationAdmin(userProfile.roles) ||
                userHasRole.titulacionAdmin(userProfile.roles) ||
                userHasRole.schoolControl(userProfile.roles) ||
                userHasRole.dev(userProfile.roles)) && (
                  <Tabs.TabPane tab="Expediente" key="11" >
                    <StudentRecord {...props} userProfile={userProfile} studentData={studentData} curp={curp} />
                  </Tabs.TabPane>
                )}
            </Tabs>
            <StudentCertificateType
              modalFielVisible={modalFielVisible}
              toggleModalFiel={toggleModalFiel}

              setCertificateParcial={setCertificateParcial}
              setCertificatePortabilidad={setCertificatePortabilidad}
              setCertificateFinal={setCertificateFinal}
              certificate={certificate}
              setCertificateAbrogrado={setCertificateAbrogrado}
              statusSchool={studentData.statusSchool}
            />
          </>
        )}
        {!studentData.curp && <StudentNotFound />}
      </PageLoading>
    </>
  );
}

function StudentNotFound() {
  return (
    <Alert
      message={<strong>Atención</strong>}
      description="No se ha encontrado ningún alumno con esta curp. Favor de verificarlo."
      type="warning"
      showIcon
    />
  );
}
