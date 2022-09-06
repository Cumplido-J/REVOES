import React, { useState, useEffect } from "react";
import { Tabs, Form, Row, Col, Input, InputNumber, Switch, Tooltip } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { Subtitle, ButtonCustomLink, PrimaryButton, Loading, SearchSelect } from "../../shared/components";

import StudentService from "../../service/StudentService";
import { validatePeriod } from "../../shared/functions";
import alerts from "../../shared/alerts";
import CatalogService from "../../service/CatalogService";

const colProps = { xs: { span: 24 }, md: { span: 8 } };
const rowProps = { style: { marginBottom: "1em" } };
const validateMessages = { required: "¡Este campo es requerido!" };
const validations = {
  score: [
    {
      required: true,
      validator: (rule, value) => {
        if (!isNaN(value) && parseFloat(value).toFixed(1) <= 10.0 && parseFloat(value).toFixed(1) >= 6.0) {
          return Promise.resolve();
        }
        else if (!isNaN(value) && parseFloat(value).toFixed(1) <= 10.0 && parseFloat(value).toFixed(1) < 6.0) {
          return Promise.reject("Ingresa una calificación aprobatoria");
        }
        return Promise.reject("Ingresa una calificación menor o igual a 10");
      },
    },
  ],
  calf: [
    {
      required: true,
      validator: (rule, value) => {
        if ((!isNaN(value) && parseFloat(value).toFixed(1) <= 10.0 && parseFloat(value).toFixed(1) >= 5.0) 
        || (value == "NP" || value == "NA" || value == "NI" || value == "Ac" || value == "***")) {
          return Promise.resolve();
        }
        return Promise.reject("Ingresa una calificación menor o igual a 10, o NP, NA, NI, Ac.");
      },
    },
  ],
  period: [
    {
      required: true,
      validator: (_, value) => {
        return validatePeriod(value) ? Promise.resolve() : Promise.reject("¡Ingresa un periodo correcto!");
      },
    },
  ],

  default: [{ required: true }],
};

async function getSubjectType() {
  const response = await CatalogService.getSubjectType();
  return response.subjects.map((subject) => ({ id: subject.id, description: subject.description1 }));
}

const getAvailableSubjects = async (curp) => {
  const response = await StudentService.getAvailableStudentSubjects(curp);
  if (!response.success) return [{}, []];
  const initialForm = {};
  const availableSubjects = {};
  const optionals = response.studentInfo.optionals;

  initialForm.totalCredits = response.studentInfo.credits;

  initialForm.semester1 = response.studentInfo.subjects.filter((subject) => subject.semester === 1);
  initialForm.semester2 = response.studentInfo.subjects.filter((subject) => subject.semester === 2);
  initialForm.semester3 = response.studentInfo.subjects.filter((subject) => subject.semester === 3);
  initialForm.semester4 = response.studentInfo.subjects.filter((subject) => subject.semester === 4);
  initialForm.semester5 = response.studentInfo.subjects.filter((subject) => subject.semester === 5);
  initialForm.semester6 = response.studentInfo.subjects.filter((subject) => subject.semester === 6);

  availableSubjects.semester1 = [...initialForm.semester1];
  availableSubjects.semester2 = [...initialForm.semester2];
  availableSubjects.semester3 = [...initialForm.semester3];
  availableSubjects.semester4 = [...initialForm.semester4];
  availableSubjects.semester5 = [...initialForm.semester5];
  availableSubjects.semester6 = [...initialForm.semester6];

  return [initialForm, optionals, availableSubjects];
};
const addSubjects = async (curp, form, availableSubjects) => {
  let subjects = [];
  if (form.semester1) {
    let tempSubjects = [...form.semester1];
    tempSubjects.forEach((subject) => {
      if(subject.score == 5){
      subject.credits = "***";}
    });
    subjects = subjects.concat(tempSubjects);
    //subjects = subjects.concat(form.semester1);
  } else {
    let tempSubjects = [...availableSubjects.semester1];
    tempSubjects.forEach((subject) => {
      subject.score = "NI";
      subject.credits = "***";
      subject.period = "**";
    });
    subjects = subjects.concat(tempSubjects);
  }

  if (form.semester2) {
    let tempSubjects = [...form.semester2];
    tempSubjects.forEach((subject) => {
      if(subject.score == 5){
      subject.credits = "***";}
    });
    subjects = subjects.concat(tempSubjects);
    //subjects = subjects.concat(form.semester2);
  } else {
    let tempSubjects = [...availableSubjects.semester2];
    tempSubjects.forEach((subject) => {
      subject.score = "NI";
      subject.credits = "***";
      subject.period = "**";
    });
    subjects = subjects.concat(tempSubjects);
  }

  if (form.semester3) {
    let tempSubjects = [...form.semester3];
    tempSubjects.forEach((subject) => {
      if(subject.score == 5){
      subject.credits = "***";}
    });
    subjects = subjects.concat(tempSubjects);
    //subjects = subjects.concat(form.semester3);
  } else {
    let tempSubjects = [...availableSubjects.semester3];
    tempSubjects.forEach((subject) => {
      subject.score = "NI";
      subject.credits = "***";
      subject.period = "**";
    });
    subjects = subjects.concat(tempSubjects);
  }

  if (form.semester4) {
    let tempSubjects = [...form.semester4];
    tempSubjects.forEach((subject) => {
      if(subject.score == 5){
      subject.credits = "***";}
    });
    subjects = subjects.concat(tempSubjects);
    //subjects = subjects.concat(form.semester4);
  } else {
    let tempSubjects = [...availableSubjects.semester4];
    tempSubjects.forEach((subject) => {
      subject.score = "NI";
      subject.credits = "***";
      subject.period = "**";
    });
    subjects = subjects.concat(tempSubjects);
  }

  if (form.semester5) {
    let tempSubjects = [...form.semester5];
    tempSubjects.forEach((subject) => {
      if(subject.score == 5){
      subject.credits = "***";}
    });
    subjects = subjects.concat(tempSubjects);
    //subjects = subjects.concat(form.semester5);
  } else {
    let tempSubjects = [...availableSubjects.semester5];
    tempSubjects.forEach((subject) => {
      subject.score = "NI";
      subject.credits = "***";
      subject.period = "**";
    });
    subjects = subjects.concat(tempSubjects);
  }

  if (form.semester6) {
    let tempSubjects = [...form.semester6];
    tempSubjects.forEach((subject) => {
      if(subject.score == 5){
      subject.credits = "***";}
    });
    subjects = subjects.concat(tempSubjects);
    //subjects = subjects.concat(form.semester6);
  } else {
    let tempSubjects = [...availableSubjects.semester6];
    tempSubjects.forEach((subject) => {
      subject.score = "NI";
      subject.credits = "***";
      subject.period = "**";
    });
    subjects = subjects.concat(tempSubjects);
  }

  const finalForm = {};
  finalForm.obtainedCredits = form.obtainedCredits;
  finalForm.finalScore = form.finalScore;
  finalForm.subjects = subjects;

  const response = await StudentService.addStudentSubjects(curp, finalForm);
  console.log("====================================");
  console.log({ response });
  console.log("====================================");
  if (!response.success) return;
  alerts.success("Éxito", response.message);
};

export default function StudentSubjectsForm({ curp, reloadStudentInfo }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [optionals, setOptionals] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState({});
  const [subjectType, setSubjectType] = useState({ subject: [] });
  console.log(optionals);

  useEffect(() => {
    const getData = async () => {
      const [initialForm, optionals, availableSubjects] = await getAvailableSubjects(curp);
      form.setFieldsValue({ ...initialForm });
      setOptionals(optionals);
      setAvailableSubjects(availableSubjects);
      setLoading(false);
    };
    getData();
  }, [form, curp]);

  useEffect(() => {
    async function loadSSubject() {
      const subject = await getSubjectType();
      setSubjectType({ subject });
    }
    loadSSubject();
  }, []);

  const handleFinish = async (values) => {
    await addSubjects(curp, values, availableSubjects);
    await reloadStudentInfo();
  };
  const handleFinishFailed = () => {
    alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };
  return (
    <Loading loading={loading}>
      <Form
        form={form}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        layout="vertical"
        validateMessages={validateMessages}
      >
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Total de créditos:" name="totalCredits">
              <InputNumber disabled style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Créditos obtenidos:" name="obtainedCredits" rules={validations.default}>
              <InputNumber
                min={0}
                max={form.getFieldValue("totalCredits   ")}
                placeholder="Calificación"
                style={{ width: "90%" }}
              />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Promedio final:" name="finalScore" rules={validations.score}>
              <InputNumber max={10} min={6} placeholder="Calificación" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1" tabPosition="left" style={{ marginBottom: "2em" }}>
          <Tabs.TabPane tab="Semestre 1" key="1">
            <SemesterSubjects form={form} name="Primer semestre" semesterNumber={1} listSubject={subjectType} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Semestre 2" key="2">
            <SemesterSubjects form={form} name="Segundo semestre" semesterNumber={2} listSubject={subjectType} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Semestre 3" key="3">
            <SemesterSubjects form={form} name="Tercer semestre" semesterNumber={3} listSubject={subjectType} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Semestre 4" key="4">
            <SemesterSubjects form={form} name="Cuarto semestre" semesterNumber={4} listSubject={subjectType} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Semestre 5" key="5">
            <SemesterSubjects form={form} name="Quinto semestre" semesterNumber={5} listSubject={subjectType} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Semestre 6" key="6">
            <SemesterSubjects form={form} name="Sexto semestre" semesterNumber={6} listSubject={subjectType} />
          </Tabs.TabPane>
        </Tabs>
        <Row {...rowProps}>
          <Col {...colProps}>
            <ButtonCustomLink link="/Alumnos/" size="large" icon={<ArrowLeftOutlined />} color="red">
              Regresar a lista de alumnos
            </ButtonCustomLink>
          </Col>
          <Col {...colProps}>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Guardar calificaciones
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}

function SemesterSubjects({ name, form, semesterNumber, listSubject }) {
  const [taken, setTaken] = useState(false);
  const onChange = () => setTaken(!taken);
  const [credito, setCredito] = useState([]);
  const onkeypressScore = (event) => {
    if(parseFloat(event.target.value).toFixed(1) < 6.0){
      //console.log(event.target.id+' '+event.target.value);
     setCredito([...credito, '***']);
    // console.log(form.getFieldValue(`semester${semesterNumber}`)[0].score);
    }else{setCredito([...credito, '1']);}    
   };
  return (
    <>
      <Subtitle>{name}</Subtitle>
      <Form.Item label="Semestre cursado:">
        <Switch checkedChildren="Si" unCheckedChildren="No" onChange={onChange} checked={taken} />
        {taken && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="text-center" style={{ minWidth: "150px" }}>
                    CCT
                  </th>
                  <th className="text-center" style={{ minWidth: "200px" }}>
                    Tipo asignatura
                  </th>
                  <th className="text-center" style={{ minWidth: "300px" }}>
                    Asignatura
                  </th>
                  <th className="text-center" style={{ minWidth: "150px" }}>
                    Calificación
                  </th>
                  <th className="text-center" style={{ minWidth: "150px" }}>
                    Créditos
                  </th>
                  <th className="text-center" style={{ minWidth: "150px" }}>
                    Horas
                  </th>
                  <th className="text-center" style={{ minWidth: "300px" }}>
                    Periodo
                    <br />
                    (Ejemplo: 17-18/2)
                  </th>
                </tr>
              </thead>
              <tbody>
                <Form.List name={`semester${semesterNumber}`}>
                  {(fields) => {
                    return (
                      <>
                        {fields.map((field, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              <Form.Item name={[field.name, "cct"]} fieldKey={[field.fieldKey, "cct"]}>
                                <Input />
                              </Form.Item>
                            </td>
                            <td className="text-center">
                              <Form.Item name={[field.name, "subjectTypeId"]} fieldKey={[field.fieldKey, "subjectTypeId"]}>
                                <SearchSelect dataset={listSubject.subject} />
                              </Form.Item>
                            </td>
                            <td className="text-center">
                              <Tooltip title={form.getFieldValue(`semester${semesterNumber}`)[field.fieldKey].name}>
                                <Form.Item name={[field.name, "name"]} fieldKey={[field.fieldKey, "name"]}>
                                  <Input />
                                </Form.Item>
                              </Tooltip>
                            </td>
                            <td className="text-center">
                              <Form.Item
                                name={[field.name, "score"]}
                                fieldKey={[field.fieldKey, "score"]}
                                rules={validations.calf}
                                onChange={onkeypressScore}
                              >
                                <Input />
                              </Form.Item>
                            </td>
                            <td className="text-center">
                            {parseFloat(form.getFieldValue(`semester${semesterNumber}`)[field.fieldKey].score).toFixed(1)>5.0  && (  
                              <Form.Item name={[field.name, "credits"]} fieldKey={[field.fieldKey, "credits"]}>
                                <Input enable />
                              </Form.Item>
                            )}
                            {(parseFloat(form.getFieldValue(`semester${semesterNumber}`)[field.fieldKey].score).toFixed(1)<5.1) && (
                              <Form.Item  fieldKey={[field.fieldKey, "credits"]}>
                              <Input enable value='***' />
                              </Form.Item>
                              )}
                              {( (form.getFieldValue(`semester${semesterNumber}`)[field.fieldKey].score == "NP") 
                              ||  (form.getFieldValue(`semester${semesterNumber}`)[field.fieldKey].score == "NA") 
                              ||  (form.getFieldValue(`semester${semesterNumber}`)[field.fieldKey].score == "NI") 
                              ||  (form.getFieldValue(`semester${semesterNumber}`)[field.fieldKey].score == "Ac")
                              ||  (form.getFieldValue(`semester${semesterNumber}`)[field.fieldKey].score == "***")
                              ) && (
                              <Form.Item  fieldKey={[field.fieldKey, "credits"]}>
                              <Input   />
                              </Form.Item>
                              )}
                              
                            </td>
                            <td className="text-center">
                              <Form.Item name={[field.name, "hours"]} fieldKey={[field.fieldKey, "hours"]}>
                                <Input enable />
                              </Form.Item>
                            </td>
                            <td className="text-center">
                              <Form.Item
                                name={[field.name, "period"]}
                                fieldKey={[field.fieldKey, "period"]}
                                rules={validations.period}
                              >
                                <Input />
                              </Form.Item>
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  }}
                </Form.List>
              </tbody>
            </table>
          </div>
        )}
      </Form.Item>
    </>
  );
}
