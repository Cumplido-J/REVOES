import React, { useEffect, useState } from "react";
import { Row, Col, Input, Form, Modal, Switch, Space, Divider, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import DegreeService from "../../service/DegreeService";
import DegreeCatalogService from "../../service/DegreeCatalogService";
import alerts from "../../shared/alerts";
import { Loading, PrimaryButton, Subtitle, SearchSelect } from "../../shared/components";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validateMessages = {
  required: "¡Este campo es requerido!",
};
const validations = {
  score: [
    {
      required: true,
      validator: (rule, value) => {
        if (!isNaN(value) && parseFloat(value).toFixed(1) <= 10.0 && parseFloat(value).toFixed(1) > 0.0) {
          return Promise.resolve();
        }
        return Promise.reject("Ingresa una calificación menor o igual a 10");
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
  default: [{ required: true }],
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
  const response = await DegreeCatalogService.getStates();
  return response.degreeStates.map((degreeState) => ({ id: degreeState.id, description: degreeState.description1 }));
}

async function stateListAll() {
  const response = await DegreeCatalogService.stateListAll();
  return response.states.map((degreeState) => ({ id: degreeState.id, description: degreeState.description1 }));
}

async function getAuthorization() {
  const response = await DegreeCatalogService.getAuths();
  return response.auths.map((auth) => ({ id: auth.id, description: auth.description1 }));
}

async function getCarrers(curp) {
  const response = await DegreeCatalogService.getCarrer(curp);
  return response.degreeCarrers.map((degreeCarrer) => ({
    id: degreeCarrer.id, description: degreeCarrer.description1 + ' - ' + degreeCarrer.description2
  }));

}


export default function DegreeValidateEdit({ curp, reloadStudents, setCurp, editable }) {
  const [carrers, setCarrers] = useState({ carrers: [] });
  const [authorizations, setAuthorizations] = useState({ authorizations: [] });
  const [modalities, setModalities] = useState({ modalities: [] });
  const [socialService, setSocialService] = useState({ socialService: [] });
  const [antecedents, setAntecedents] = useState({ antecedents: [] });
  const [states, setStates] = useState({ states: [] });
  const [editing, setEditing] = useState(true);
  const [entity, setEntity] = useState({ states: [] });

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [modality, setModality] = useState(null);
  const [name, setName] = useState("");

  async function onChangeModality(modalityId) {
    if (modalityId == 1) {
      setEditing(true);
      setModality(modalityId);
    } else {
      setEditing(false);
      setModality(modalityId);
    }
  }

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

  const socialServiceList =
    [
      {
        id: 1, description: "SI"
      },
      {
        id: 2, description: "NO",
      }
    ];

  useEffect(() => {
    const getStudentData = async () => {
      setLoading(true);
      const response = await DegreeService.getStudentData(curp);
      setLoading(false);
      if (!response.success) return;
      setStudentData(response.studentData);
      form.setFieldsValue({ ...response.studentData });
      setShowModal(true);
    };
    if (curp === null) {
      setStudentData({});
      setToggleEdit(false);
      setShowModal(false);
    } else {
      getStudentData();
    }
  }, [curp, form]);

  useEffect(() => {
    async function loadCarrer() {
      const carrers = await getCarrers(curp);
      setCarrers({ carrers });
    }
    if (curp === null) {
      setCarrers({ carrers: [] });
    } else {
      loadCarrer();
    }

  }, [curp]);

  const handleFinishFailed = () => {
    alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };
  const reloadStudentData = async () => {
    setLoading(true);
    const response = await DegreeService.getStudentData(curp);
    setLoading(false);
    if (!response.success) return;
    setStudentData(response.studentData);
  };


  const editStudent = async (values) => {
    setLoading(true);
    const curp = studentData.curp;
    const response = await DegreeService.editStudent(curp, values);
    setLoading(false);
    if (!response.success) return;
    await reloadStudentData();
    await reloadStudents();
    alerts.success(response.message);
  };

  const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };
  
  return (
    <Modal
      onCancel={() => {
        setCurp(null);
      }}
      visible={showModal}
      width="66%"
      zIndex={1040}
      centered
      title={"Alumno"}
      footer={[
        <Button key="back" onClick={() => setCurp(null)} >
            Cerrar
        </Button>,
    ]}
    >
      <Loading loading={loading}>
        <Subtitle>Información alumno</Subtitle>
        {editable && (
          <Space size="middle" style={{ marginBottom: "1em" }}>
            <strong>Editar alumno: </strong>
            <Switch checkedChildren="Si" unCheckedChildren="No" onChange={() => { setToggleEdit(!toggleEdit); }} checked={toggleEdit} />

          </Space>
        )}

        <Form validateMessages={validateMessages} form={form} onFinish={editStudent} onFinishFailed={handleFinishFailed} layout="vertical">

          <Row {...rowProps}>
            <Col span={24}>
              <Divider orientation="left">Profesionista</Divider>
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col {...colProps}>
              <Form.Item label="Nombre:" name="name">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="Primer Apellido:" name="firstLastName">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="Segundo Apellido:" name="secondLastName">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col {...colProps}>
              <Form.Item label="CURP:" name="curp">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="Matrícula:" name="enrollmentKey">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="E-mail:" name="email">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]} {...rowProps}>
            <Col span={24}>
              <Divider orientation="left">Institución</Divider>
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col span={8}>
              <Form.Item label="Clave en DGP:" name="schoolKey">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="Plantel en DGP:" name="schoolName">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={[24, 16]} {...rowProps}>
            <Col span={24}>
              <Divider orientation="left">Carrera</Divider>
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Carrera:" name="carrerId" rules={validations.carrerId}>
                  <SearchSelect disabled dataset={carrers.carrers} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Carrera:" name="carrerId" rules={validations.carrerId}>
                  <SearchSelect dataset={carrers.carrers} />
                </Form.Item>
              )}
            </Col>

            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Fecha de Inicio:" name="startDateCarrer" rules={validations.startDate}>
                  <Input disabled type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Fecha de Inicio:" name="startDateCarrer" rules={validations.startDate}>
                  <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>

            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Fecha de Término:" name="endDateCarrer" rules={validations.endDate}>
                  <Input disabled type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Fecha de Término:" name="endDateCarrer" rules={validations.endDate}>
                  <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Autorización de Reconocimiento:" name="autorizationId" rules={validations.autorizationId}>
                  <SearchSelect disabled dataset={authorizations.authorizations} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Autorización de Reconocimiento:" name="autorizationId" rules={validations.autorizationId}>
                  <SearchSelect dataset={authorizations.authorizations} />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col span={24}>
              <Divider orientation="left">Expedición</Divider>
            </Col>
          </Row>


          <Row {...rowProps}>

            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Fecha de expedición:" name="expeditionData" rules={validations.expeditionData}>
                  <Input disabled type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Fecha de expedición:" name="expeditionData" rules={validations.expeditionData}>
                  <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>

            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Modalidad:" name="modalityId" rules={validations.modalityId} >
                  <SearchSelect disabled dataset={modalities.modalities} onChange={onChangeModality} values={modalities} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Modalidad:" name="modalityId" rules={validations.modalityId} >
                  <SearchSelect dataset={modalities.modalities} onChange={onChangeModality} />
                </Form.Item>
              )}
            </Col>

            <Col {...colProps}>
              <TypeExaminationDate typeSatus={editing} toggleEdit={toggleEdit} modalityId={studentData.modalityId} studentData={studentData} form={form} setEditing={setEditing} modality={modality} />
            </Col>

          </Row>

          <Row {...rowProps}>
            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Fundamento Legal Servicio Social:" name="legalBasisId" rules={validations.legalBasisId}>
                  <SearchSelect disabled dataset={socialService.socialService} placeholder="Nombre" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Fundamento Legal Servicio Social:" name="legalBasisId" rules={validations.legalBasisId}>
                  <SearchSelect dataset={socialService.socialService} placeholder="Nombre" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>

            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Cumplimiento de Servicio Social:" name="socialService" rules={validations.socialService}>
                  <SearchSelect disabled dataset={socialServiceList} placeholder="Nombre" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Cumplimiento de Servicio Social:" name="socialService" rules={validations.socialService}>
                  <SearchSelect dataset={socialServiceList} placeholder="Nombre" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>

            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Entidad federativa:" name="federalEntityId" rules={validations.federalEntityId}>
                  <SearchSelect disabled dataset={states.states} placeholder="Nombre" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Entidad federativa:" name="federalEntityId" rules={validations.federalEntityId}>
                  <SearchSelect dataset={states.states} placeholder="Nombre" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col span={24}>
              <Divider orientation="left">Antecedente</Divider>
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Institución de Procedencia:" name="institutionOrigin" rules={validations.institutionOrigin}>
                  <Input disabled placeholder="Institución Procedencia" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Institución de Procedencia:" name="institutionOrigin" rules={validations.institutionOrigin}>
                  <Input placeholder="Institución Procedencia" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>

            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Tipo antecedente:" name="institutionOriginTypeId" rules={validations.institutionOriginTypeId}>
                  <SearchSelect disabled dataset={antecedents.antecedents} placeholder="Nombre" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Tipo antecedente:" name="institutionOriginTypeId" rules={validations.institutionOriginTypeId}>
                  <SearchSelect dataset={antecedents.antecedents} placeholder="Nombre" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>

            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Entidad federativa:" name="federalEntityOriginId" rules={validations.federalEntityOriginId}>
                  <SearchSelect disabled dataset={entity.states} placeholder="Entidad de Origen" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Entidad federativa:" name="federalEntityOriginId" rules={validations.federalEntityOriginId}>
                  <SearchSelect dataset={entity.states} placeholder="Entidad de Origen" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Fecha de Inicio:" name="startDate" rules={validations.startDate}>
                  <Input disabled type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Fecha de Inicio:" name="startDate" rules={validations.startDate}>
                  <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>

            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Fecha de Término:" name="endDate" rules={validations.endDate}>
                  <Input disabled type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Fecha de Término:" name="endDate" rules={validations.endDate}>
                  <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>
          </Row>



          {toggleEdit && (
            <Form.Item style={{ textAlign: "center" }}>
              <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} fullWidth={true}>
                Actualizar datos
              </PrimaryButton>
            </Form.Item>
          )}
        </Form>
      </Loading>
    </Modal>
  );
}

function TypeExaminationDate({ typeSatus, toggleEdit, modalityId, studentData, form, setEditing, modality }) {
  const [state, setState] = useState(null);
  useEffect(() => {
    if (modality == null) {
      setState(modalityId);
    } else {
      setState(modality);
    }    
  }, [modality, modalityId])

  let fecha;
  if (studentData.examinationDate != null) {
    fecha = studentData.examinationDate;
  } else {
    fecha = studentData.exemptionDate;
  }

  console.log(typeSatus+'-------'+state)

  let title, nameInput;
  if (typeSatus == true && state == 1) {
    form.setFieldsValue({ 'examinationDate': fecha });
    title = 'Fecha de exámen profesional:';
    nameInput = 'examinationDate';
  } else {    
    form.setFieldsValue({ 'exemptionDate': fecha })
    title = 'Fecha de exención exámen profesional:';
    nameInput = 'exemptionDate';
  }

  //if (typeSatus) {
  return (<>

    {!toggleEdit && (
      <Form.Item label={title} name={nameInput} rules={validations.examinationDate} >
        <Input disabled type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
      </Form.Item>

    )}
    {toggleEdit && (
      <Form.Item label={title} name={nameInput} rules={validations.examinationDate} >
        <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
      </Form.Item>
    )}
  </>
  );

  /* } else {
 
 
   return (
     <>
       {!toggleEdit && (
       <Form.Item label="Fecha de exención exámen profesional:" name="exemptionDate" rules={validations.examinationDate}>
         <Input disabled type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
       </Form.Item>
       )}
       {toggleEdit && (
       <Form.Item label="Fecha de exención exámen profesional:" name="exemptionDate" rules={validations.examinationDate}>
         <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
       </Form.Item>
       )}
     </>);
   }*/
}
