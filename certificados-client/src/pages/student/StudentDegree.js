import React, { useEffect, useState } from "react";
import { Alert, Form, Row, Col, InputNumber, Input, DatePicker, Divider } from "antd";
import { CheckCircleOutlined, SettingOutlined, CalendarOutlined, AuditOutlined } from "@ant-design/icons";

import Alerts from "../../shared/alerts";
import { Loading, SearchSelect, PrimaryButton } from "../../shared/components";

import DegreeCatalogService from "../../service/DegreeCatalogService";
import { validateCurp } from "../../shared/functions";
import DegreeService from "../../service/DegreeService";
import StudentDegreeData from "./StudentDegreeData";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

const validations = {
  curp: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurp(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP correcta!");
      },
    },
  ],

  carrerId: [{ required: true, message: "¡La carrera es requerida!" }],
  startDateCarrer: [{ required: true, message: "¡La fecha de inicio es requerida!" }],
  endDateCarrer: [{ required: true, message: "¡La fecha de término es requerida!" }],
  autorizationId: [{ required: true, message: "¡La autorización de reconocimiento es requerido!" }],
  expeditionData: [{
    required: true,
    validator: (rule, value) => {
      let hoy = new Date(); let select = new Date(value);
      //alert(select.getDate() +'<'+ hoy.getDate()+'---'+(select.getMonth() + 1) +'=='+ (hoy.getMonth() + 1))
      if ((select.getDate() < hoy.getDate() && (select.getMonth() + 1) == (hoy.getMonth() + 1) && select.getFullYear() == hoy.getFullYear()) ||

        (/*(select.getDate() >= hoy.getDate() || select.getDate() <= hoy.getDate()) &&*/ (select.getMonth() + 1) < (hoy.getMonth() + 1) && select.getFullYear() <= hoy.getFullYear()) /*||
        ((select.getDate() <= hoy.getDate() || select.getDate() >= hoy.getDate()) && (select.getMonth() + 1) > (hoy.getMonth() + 1) && select.getFullYear() <= hoy.getFullYear())*/
      ) {
        return Promise.resolve();
      }
      return Promise.reject("¡La fecha no puede ser igual o posterior al dia de hoy!");
    },
  }],
  examinationDate: [{ required: true, message: "¡La fecha del exámen profesional es requerido!" }],
  modalityId: [{ required: true, message: "¡La modalidad es requerido!" }],
  legalBasisId: [{ required: true, message: "¡El fundamento legal es requerido!" }],
  socialService: [{ required: true, message: "¡El servicio social es requerido!" }],
  federalEntityId: [{ required: true, message: "¡La entidad federartiva es requerido!" }],

  institutionOrigin: [{ required: true, message: "¡La institución de Procedencia es requerido!" }],
  institutionOriginTypeId: [{ required: true, message: "¡El tipo de estudio es requerido!" }],
  federalEntityOriginId: [{ required: true, message: "¡La entidad federativa es requerido!" }],
  startDate: [{ required: true, message: "¡La fecha de inicio es requerida!" }],
  endDate: [{ required: true, message: "¡La fecha de término es requerida!" }],
};

async function getModalities() {
  const response = await DegreeCatalogService.getModalities();
  return response.modalities.map((modalitie) => ({ id: modalitie.id, description: modalitie.description1 }));
}

async function getSocialService() {
  const response = await DegreeCatalogService.getSocialService();
  return response.socialService.map((s) => ({ id: s.id, description: s.description1 }));
}

async function getAntecedents() {
  const response = await DegreeCatalogService.getAntecedents();
  return response.antecedents.map((antecedent) => ({ id: antecedent.id, description: antecedent.description1 }));
}

async function getStates() {
  const response = await DegreeCatalogService.getAllStates();
  return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}

async function stateListAll() {
  const response = await DegreeCatalogService.stateListAll();
  return response.states.map((degreeState) => ({ id: degreeState.id, description: degreeState.description1 }));
}

async function getCarrers(curp) {
  const response = await DegreeCatalogService.getCarrer(curp);
  return response.degreeCarrers.map((degreeCarrer) => ({
    id: degreeCarrer.id, description: degreeCarrer.description1 + ' - ' + degreeCarrer.description2
  }));

}

async function studentPeriod(curp) {
  const response = await DegreeCatalogService.studentPeriodDate(curp);
  return response.period[0];/*.map((p) => ({
    startDateCarrer: p.startDateCareer,
    endDateCarrer: p.endDateCareer
  }));*/
}

async function getStudentView(curp) {
  const response = await DegreeService.degreeStudentView(curp);
  return response;
}


async function getAuthorization() {
  const response = await DegreeCatalogService.getAuths();
  return response.auths.map((auth) => ({ id: auth.id, description: auth.description1 }));
}

export default function StudentDegree({ curp }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalities, setModalities] = useState({ modalities: [] });
  const [socialService, setSocialService] = useState({ socialService: [] });
  const [antecedents, setAntecedents] = useState({ antecedents: [] });
  const [states, setStates] = useState({ states: [] });
  const [carrers, setCarrers] = useState({ carrers: [] });
  const [authorizations, setAuthorizations] = useState({ authorizations: [] });
  const [editing, setEditing] = useState(false);
  const [degree, setDegree] = useState({ degree: [] });
  const [entity, setEntity] = useState({ states: [] });
  const [name, setName] = useState("");

  const loadDegree = async (curp) => {
    const response = await getStudentView(curp);
    if (!response.success) return;
    setDegree(response.degreeView)
  }
  useEffect(() => {
    /*const loadDegree = async () => {
      const response = await getStudentView(curp);
      if (!response.success) return;
      setDegree(response.degreeView)
    }*/
    loadDegree(curp);
  }, [curp]);

  useEffect(() => {
    async function loadModalities() {
      const modalities = await getModalities();
      setModalities({ modalities });
    }

    async function loadgetSocialService() {
      const socialService = await getSocialService();
      setSocialService({ socialService });
    }

    async function loadgetAntecedents() {
      const antecedents = await getAntecedents();
      setAntecedents({ antecedents });
    }

    async function loadState() {
      const states = await getStates();
      setStates({ states });
    }

    async function loadAuthorization() {
      const authorizations = await getAuthorization();
      setAuthorizations({ authorizations })
    }

    async function loadEntity() {
      const states = await stateListAll();
      setEntity({ states })
    }

    loadEntity();
    loadAuthorization();
    loadState();
    loadgetAntecedents();
    loadModalities();
    loadgetSocialService();
  }, []);

  useEffect(() => {
    async function loadCarrer() {
      const carrers = await getCarrers(curp);
      setCarrers({ carrers });
    }
    loadCarrer();
  }, [curp]);

  useEffect(() => {
    async function loadPeriod() {
      const period = await studentPeriod(curp);
      form.setFieldsValue({ 'startDateCarrer': period.startDateCarrer, });
      form.setFieldsValue({ 'endDateCarrer': period.endDateCarrer, });
    }
    loadPeriod();
  }, [curp]);



  const handleFinish = async (values) => {
    setLoading(true);
    const response = await DegreeService.antecedentDegree(curp, values);
    setLoading(false);
    if (!response.success) return;
    Alerts.success("Antecedente guardado !", "Datos guardados correctamente");
    await loadDegree(curp);
  };

  const socialServiceList =
    [
      {
        id: "1", description: "SI"
      },
      {
        id: "0", description: "NO",
      }
    ];

  async function onChangeModality(modalityId) {
    if (modalityId == 1) {
      setEditing(true);
    } else {
      setEditing(false);
    }
  }

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  return (
    <Loading loading={loading}>
      {degree.length > 0 && (
        <>
          <StudentDegreeData dataset={degree} />
        </>
      )}

      {degree.length == 0 && (
        <>
          <Alert
            style={{ marginBottom: "2em" }}
            message={<strong>ATENCIÓN.</strong>}
            description="Esta sección es exclusiva para la captura de información para el título del alumno."
            type="info"
            showIcon
          />
          {carrers.carrers.length == 0 && (
            <>
              <Alert
                style={{ marginBottom: "2em" }}
                message={<strong>ATENCIÓN.</strong>}
                description="Puede que su plantel no procede a titulación o las carreras en DGP no han sido dadas de alta, porfavor informese."
                type="info"
                showIcon
              />
            </>
          )}
          {carrers.carrers.length > 0 && (
            <>


              <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical" >
                <Row gutter={[24, 16]} {...rowProps}>
                  <Col span={24}>
                    <Divider orientation="left"><SettingOutlined /> Carrera</Divider>
                  </Col>
                </Row>

                <Row {...rowProps}>
                  <Col {...colProps}>
                    <Form.Item label="Carrera en DGP:" name="carrerId" rules={validations.carrerId}>
                      <SearchSelect dataset={carrers.carrers} />
                    </Form.Item>
                  </Col>

                  <Col {...colProps}>
                    <Form.Item label="Fecha de Inicio de Carrera:" name="startDateCarrer" rules={validations.startDateCarrer}>
                      {/*<DatePicker format="DD/MM/YYYY"  style={{ width: "90%" }} />*/}
                      <Input placeholder="" disabled style={{ width: "90%" }} />

                    </Form.Item>
                  </Col>

                  <Col {...colProps}>
                    <Form.Item label="Fecha de Término de Carrera:" name="endDateCarrer" rules={validations.endDateCarrer}>
                      {/*<DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />*/}
                      <Input placeholder="" disabled style={{ width: "90%" }} />

                    </Form.Item>
                  </Col>
                </Row>

                <Row {...rowProps}>
                  <Col {...colProps}>
                    <Form.Item label="Autorización de Reconocimiento:" name="autorizationId" rules={validations.autorizationId}>
                      <SearchSelect dataset={authorizations.authorizations} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row {...rowProps}>
                  <Col span={24}>
                    <Divider orientation="left"><CalendarOutlined /> Expedición</Divider>
                  </Col>
                </Row>


                <Row {...rowProps}>

                  <Col {...colProps}>
                    <Form.Item label="Fecha de expedición:" name="expeditionData" rules={validations.expeditionData}>
                      <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
                    </Form.Item>
                  </Col>

                  <Col {...colProps}>
                    <Form.Item label="Modalidad:" name="modalityId" rules={validations.modalityId} >
                      <SearchSelect dataset={modalities.modalities} onChange={onChangeModality} />
                    </Form.Item>
                  </Col>

                  <Col {...colProps}>
                    <TypeExaminationDate typeSatus={editing} />
                  </Col>

                  <Col {...colProps}>

                  </Col>
                </Row>

                <Row {...rowProps}>
                  <Col {...colProps}>
                    <Form.Item label="Fundamento Legal Servicio Social:" name="legalBasisId" rules={validations.legalBasisId}>
                      <SearchSelect dataset={socialService.socialService} placeholder="Nombre" style={{ width: "90%" }} />
                    </Form.Item>
                  </Col>

                  <Col {...colProps}>
                    <Form.Item label="Cumplimiento de Servicio Social:" name="socialService" rules={validations.socialService}>
                      <SearchSelect dataset={socialServiceList} placeholder="Nombre" style={{ width: "90%" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row {...rowProps}>
                  <Col span={24}>
                    <Divider orientation="left"><AuditOutlined /> Antecedente</Divider>
                  </Col>
                </Row>

                <Row {...rowProps}>
                  <Col {...colProps}>
                    <Form.Item label="Institución de Procedencia:" name="institutionOrigin" rules={validations.institutionOrigin}>
                      <Input placeholder="Institución Procedencia" style={{ width: "90%" }} />
                    </Form.Item>
                  </Col>

                  <Col {...colProps}>
                    <Form.Item label="Tipo antecedente:" name="institutionOriginTypeId" rules={validations.institutionOriginTypeId}>
                      <SearchSelect dataset={antecedents.antecedents} placeholder="Nombre" style={{ width: "90%" }} />
                    </Form.Item>
                  </Col>

                  <Col {...colProps}>
                    <Form.Item label="Entidad federativa:" name="federalEntityOriginId" rules={validations.federalEntityOriginId}>
                      <SearchSelect dataset={entity.states} placeholder="Nombre" style={{ width: "90%" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row {...rowProps}>
                  <Col {...colProps}>
                    <Form.Item label="Fecha de Inicio:" name="startDate" rules={validations.startDate}>
                      <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
                    </Form.Item>
                  </Col>

                  <Col {...colProps}>
                    <Form.Item label="Fecha de Término:" name="endDate" rules={validations.endDate}>
                      <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row {...rowProps}>
                  <Col {...colProps}>
                    <Form.Item>
                      <PrimaryButton
                        fullWidth={true}
                        color="volcano"
                        icon={<CheckCircleOutlined />}
                      >
                        Guardar Información
                      </PrimaryButton>
                    </Form.Item>
                  </Col>

                </Row>
              </Form>
            </>
          )}

        </>
      )}
    </Loading>
  );
}

function TypeExaminationDate(props) {
  const typeSatus = props.typeSatus;
  if (typeSatus) {
    return (
      <Form.Item label="Fecha de exámen profesional:" name="examinationDate" rules={validations.examinationDate} >
        <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
      </Form.Item>
    );
  }
  return (
    <Form.Item label="Fecha de exención exámen profesional:" name="exemptionDate" rules={validations.examinationDate}>
      <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
    </Form.Item>
  );
}
