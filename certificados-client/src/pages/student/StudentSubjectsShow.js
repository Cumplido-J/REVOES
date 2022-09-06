import React, { useState, useEffect } from "react";
import { Subtitle, SearchSelect } from "../../shared/components";
import { Modal, Form, Row, Col, Input, InputNumber, Switch, Tooltip, Button } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import CatalogService from "../../service/CatalogService";
import { validatePeriod } from "../../shared/functions";
import alerts from "../../shared/alerts";
import StudentService from "../../service/StudentService";

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
        if ((!isNaN(value) && parseFloat(value).toFixed(1) <= 10.0 && parseFloat(value).toFixed(1) >= 5.0) || (value == "NP" || value == "NA" || value == "NI" || value == "Ac")) {
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

  default: [{ required: true , message: "¡Este campo es requerible!"}],
};

async function getSubjectType() {
  const response = await CatalogService.getSubjectType();
  return response.subjects.map((subject) => ({ id: subject.id, description: subject.description1 }));
}

export default function StudentSubjectsShow({ curp, studentInfo, reloadStudentInfo }) {
  console.log('====================================');
  console.log({ studentInfo });
  console.log('====================================');
  //alert(JSON.stringify(studentInfo))
  const credits = {
    'curp': curp,
    'totalCredits': studentInfo.totalCredits,
    'obtainedCredits': studentInfo.obtainedCredits,
    'finalScore': studentInfo.finalScore
  };
  return (
    <>
      <Subtitle>Datos del alumno</Subtitle>
     
      <p>
        <label>Créditos totales: </label> {studentInfo.totalCredits}
      </p>
      <p>
        <label>Créditos obtenidos: </label> {studentInfo.obtainedCredits}
      </p>
      <p>
        <label>Promedio final: </label> {studentInfo.finalScore}
      </p>
      <div>
        <ModatEditCredit credits={credits} reloadStudentInfo={reloadStudentInfo} />
      </div>
      <div align="right">
        <ModalNewRows curp={curp} reloadStudentInfo={reloadStudentInfo} />
      </div>
      <SemesterTableStatic name="Primer Semestre" semesterInfo={studentInfo.semester1} reloadStudentInfo={reloadStudentInfo} />
      <SemesterTableStatic name="Segundo Semestre" semesterInfo={studentInfo.semester2} reloadStudentInfo={reloadStudentInfo} />
      <SemesterTableStatic name="Tercer Semestre" semesterInfo={studentInfo.semester3} reloadStudentInfo={reloadStudentInfo} />
      <SemesterTableStatic name="Cuarto Semestre" semesterInfo={studentInfo.semester4} reloadStudentInfo={reloadStudentInfo} />
      <SemesterTableStatic name="Quinto Semestre" semesterInfo={studentInfo.semester5} reloadStudentInfo={reloadStudentInfo} />
      <SemesterTableStatic name="Sexto Semestre" semesterInfo={studentInfo.semester6} reloadStudentInfo={reloadStudentInfo} />
    </>
  );
}

function SemesterTableStatic({ name, semesterInfo, reloadStudentInfo }) {
  const [form] = Form.useForm();
  form.setFieldsValue({ ...semesterInfo });
  const [subjectType, setSubjectType] = useState({ subject: [] });

  useEffect(() => {
    async function loadSSubject() {
      const subject = await getSubjectType();
      setSubjectType({ subject });
    }
    loadSSubject();
  }, []);

  const showDeleteConfirm = async (subject) => {
    form.setFieldsValue({ ...subject });
    const confirmDelete = async (values) => {
      if (!values) return;
      const response = await StudentService.deleteScoreStudent(values);
      if (!response.success) return;
      alerts.success("Registro Eliminado !", "Registro eliminado correctamente");
      await reloadStudentInfo();
    };

    Modal.confirm({
      title: '¿Seguro que desea eliminar este registro?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>

          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <th>CCT:</th>
                <td>{subject.cct}</td>
              </tr>
              <tr>
                <th>Tipo asignatura:</th>
                <td>{subject.subjectType}</td>
              </tr>
              <tr>
                <th>Asignatura:</th>
                <td>{subject.name}</td>
              </tr>
            </tbody>
          </table>
          <Form form={form} onFinish={confirmDelete} layout="vertical">
            <Form.Item name="partialId">
              <Input type="hidden" />
            </Form.Item>
          </Form>
        </>
      ),
      okText: 'Aceptar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: form.submit,
      onCancel() {
        console.log('Cancel');
      },
      centered: true,
      zIndex: 1040,

    });
  }

  return (
    <>
      <br />
      <Subtitle>{name}</Subtitle>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="text-center" style={{ minWidth: "90px" }}>
                <EditOutlined style={{ fontSize: '16px', color: '#096dd9' }} theme="outlined" />
              </th>
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
                Horas
              </th>
              <th className="text-center" style={{ minWidth: "150px" }}>
                Créditos
              </th>
              <th className="text-center" style={{ minWidth: "300px" }}>
                Periodo
                <br />
                (Ejemplo: 17-18/2)
              </th>
              <th>
                <DeleteOutlined style={{ fontSize: '16px', color: '#f5222d' }} theme="outlined" />
              </th>
            </tr>
          </thead>
          <tbody>
            {semesterInfo.map((subject, index) => (
              <tr key={index}>
                <td className="text-center">
                  <ModatEdit subject={subject} listSubject={subjectType} reloadStudentInfo={reloadStudentInfo} />
                </td>
                <td className="text-center"> {subject.cct} </td>
                <td className="text-center"> {subject.subjectType} </td>
                <td className="text-center"> {subject.name} </td>
                <td className="text-center"> {subject.score} </td>
                <td className="text-center"> {subject.hours} </td>
                <td className="text-center"> {subject.credits} </td>
                <td className="text-center"> {subject.period} </td>
                <td>
                  <Tooltip title="Eliminar Fila">
                    <Link to="#" onClick={(e) => showDeleteConfirm(subject)}><DeleteOutlined style={{ fontSize: '16px', color: '#f5222d' }} theme="outlined" /></Link>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}


function ModatEdit({ subject, listSubject, reloadStudentInfo }) {
  const [form] = Form.useForm();
  form.setFieldsValue({ ...subject });

  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setState(true);
  };

  const handleOk = () => {
    setLoading(true);
    setState(true);

  };

  const handleCancel = () => {
    setState(false);
  };

  const handleChange = (e) => {
    if (parseFloat(e.target.value) < 5.0) {
      form.setFieldsValue({ 'credits': '***', });
      form.setFieldsValue({ 'score': '***', });
    }
    if (parseFloat(e.target.value) >= 5.0) {
      form.setFieldsValue({ 'credits': subject.credits, });
    }
    if (e.target.value == 'NA' || e.target.value == 'NI' || e.target.value == 'NP') {
      form.setFieldsValue({ 'credits': '***', });
    }
  }

  const handleFinish = async (values) => {
    setLoading(true);
    const response = await StudentService.updateScoreStudent(values);
    if (!response.success) return;
    alerts.success("Registro Actualizado !", "Datos guardados correctamente");
    await reloadStudentInfo();
    setLoading(false);
  };

  const handleFinishFailed = () => {
    alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  return (
    <>
      <Tooltip title="Editar Fila">
        <Link to="#" tooltip="Editar Fila" onClick={showModal}><EditOutlined /></Link>
      </Tooltip>
      <Modal visible={state} title="Editar Calificación" onOk={handleOk}
        onCancel={handleCancel} width={1000}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={form.submit}>
            Guardar
          </Button>,
        ]} >

        <Form form={form}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          layout="vertical">
          <div className="table-responsive">

            <table className="table table-striped">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
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

                <tr>
                  <td>
                    <Form.Item name="partialId">
                      <Input type="hidden" />
                    </Form.Item>
                  </td>
                  <td>
                    <Form.Item name="studentId">
                      <Input type="hidden" />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="cct" rules={validations.default}>
                      <Input type="text" />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="subjectTypeId" rules={validations.default}>
                      <SearchSelect dataset={listSubject.subject} />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="name" rules={validations.default}>
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="score" rules={validations.calf} >
                      <Input type="text" min="0.0" max="10" onChange={handleChange} />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="credits" rules={validations.default}>
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="hours" rules={validations.default}>
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="period" rules={validations.period}>
                      <Input />
                    </Form.Item>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </Form>
      </Modal>
    </>
  );
}

function ModatEditCredit({ credits, reloadStudentInfo }) {
  const [form] = Form.useForm();
  form.setFieldsValue({ ...credits });

  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setState(true);
  };

  const handleOk = () => {
    setLoading(true);
    setState(true);

  };

  const handleCancel = () => {
    setState(false);
  };



  const handleFinish = async (values) => {
    setLoading(true);
    const response = await StudentService.updateCreditsStudent(values);
    if (!response.success) return;
    alerts.success("Registro Actualizado !", "Datos guardados correctamente");
    await reloadStudentInfo();
    setLoading(false);
  };

  const handleFinishFailed = () => {
    alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  return (
    <>
      <Tooltip title="Editar Creditos">
        <Link to="#" onClick={showModal}><EditOutlined /></Link>
      </Tooltip>

      <Modal visible={state} title="Editar Credito" onOk={handleOk}
        onCancel={handleCancel} width={1000}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={form.submit}>
            Guardar
          </Button>,
        ]} >

        <Form form={form}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          layout="vertical">
          <div className="table-responsive">

            <table className="table table-striped">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th className="text-center" style={{ minWidth: "150px" }}>
                    Créditos totales
                  </th>
                  <th className="text-center" style={{ minWidth: "200px" }}>
                    Créditos obtenidos
                  </th>
                  <th className="text-center" style={{ minWidth: "300px" }}>
                    Promedio final:
                  </th>

                </tr>
              </thead>
              <tbody>

                <tr>
                  <td>

                  </td>
                  <td>
                    <Form.Item name="curp">
                      <Input type="hidden" />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item label="Total de créditos:" name="totalCredits">
                      <InputNumber disabled style={{ width: "90%" }} />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item label="Créditos obtenidos:" name="obtainedCredits" rules={validations.default}>
                      <InputNumber min={0} max={form.getFieldValue("totalCredits   ")} placeholder="Calificación" style={{ width: "90%" }} />
                    </Form.Item>
                  </td>

                  <td className="text-center">
                    <Form.Item label="Promedio final:" name="finalScore" rules={validations.score}>
                      <InputNumber max={10} min={6} placeholder="Calificación" style={{ width: "90%" }} />
                    </Form.Item>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>

        </Form>
      </Modal>
    </>
  );
}

function ModalNewRows({ curp, reloadStudentInfo }) {
  const [form] = Form.useForm();
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjectType, setSubjectType] = useState({ subject: [] });

  useEffect(() => {
    async function loadSSubject() {
      const subject = await getSubjectType();
      setSubjectType({ subject });
    }
    loadSSubject();
  }, []);

  const showModal = () => {
    setState(true);
  };

  const handleOk = () => {
    setLoading(true);
    setState(true);

  };

  const handleCancel = () => {
    setState(false);
  };

  const handleChange = (e) => {
    if (parseFloat(e.target.value) < 5.0) {
      form.setFieldsValue({ 'credits': '***', });
      form.setFieldsValue({ 'score': '***', });
    }
    if (parseFloat(e.target.value) >= 5.0) {
      form.setFieldsValue({ 'credits': e.target.value, });
    }
    if (e.target.value == 'NA' || e.target.value == 'NI' || e.target.value == 'NP') {
      form.setFieldsValue({ 'credits': '***', });
    }
  }

  const handleFinish = async (values) => {
    setLoading(true);
    const response = await StudentService.addStudentSubjectsRow(values, curp);
    if (!response.success) return;
    alerts.success("Registro Guardado !", "Datos guardados correctamente");
    await reloadStudentInfo();
    setLoading(false);
  };

  const handleFinishFailed = () => {
    alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  const semestres = [
    { id: 1, description: "1 Semestre" },
    { id: 2, description: "2 Semestre" },
    { id: 3, description: "3 Semestre" },
    { id: 4, description: "4 Semestre" },
    { id: 5, description: "5 Semestre" },
    { id: 6, description: "6 Semestre" },
  ]

  return (
    <>
      <Tooltip title="Agregar nueva fila">
        <Link className="btn btn-primary btn-sm" to="#" onClick={showModal}><PlusCircleOutlined /> Nueva fila</Link>
      </Tooltip>
      <Modal visible={state} title="Agregar nueva fila" onOk={handleOk}
        onCancel={handleCancel} width={1000}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit}>
            Guardar
          </Button>,
        ]} >

        <Form form={form}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          layout="vertical">
          <div className="table-responsive">

            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="text-center" style={{ minWidth: "150px" }}>
                    Semestre
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

                <tr>

                  <td className="text-center">
                    <Form.Item name="semester" rules={validations.default}>
                      <SearchSelect dataset={semestres} />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="subjectTypeId" rules={validations.default}>
                      <SearchSelect dataset={subjectType.subject} />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="name" rules={validations.default}>

                      <Input />


                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="score" rules={validations.calf} >
                      <Input type="text" min="0.0" max="10" onChange={handleChange} />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="credits" rules={validations.default}>
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="hours" rules={validations.default}>
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="text-center">
                    <Form.Item name="period" rules={validations.period}>
                      <Input />
                    </Form.Item>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </Form>
      </Modal>
    </>
  );
}