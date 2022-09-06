import React, { useEffect, useState } from "react";
import { Steps, Table, Form, Row, Col } from "antd";
import RegisteredSubjects from "./RegisteredSubjects";
import {
  SearchSelect,
  Loading,
  PrimaryButton,
  ButtonCustom,
} from "../../../shared/components";
import { CheckCircleOutlined, LeftOutlined } from "@ant-design/icons";
import StudentService from "../../../service/StudentService";
import alerts from "../../../shared/alerts";

const validations = {
  required: [
    {
      required: true,
      message: "Este campo es requerido",
    },
  ],
};

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};

export default ({ studentData }) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [registeredSubjects, setRegisteredSubjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(undefined);
  const steps = ["Seleccionar materia", "Seleccionar grupo"];

  const setUp = async () => {
    setLoading(true);
    const uacResponse = await StudentService.uacSignaturesFromIrregularStudentById(
      studentData.usuario_id
    );
    if (uacResponse && uacResponse.success) {
      setLoading(false);
      setSubjects(
        uacResponse.data.map((s) => ({
          id: s.id,
          description: s.uac.nombre,
        }))
      );
    }
  };

  const getRegisteredSubjects = async () => {
    setLoading(true);
    const registeredUacResponse = await StudentService.getUacFromIrregularStudents(
      studentData.usuario_id
    );
    if (registeredUacResponse && registeredUacResponse.success) {
      setRegisteredSubjects(
        registeredUacResponse.data.map((uac) => ({
          id: uac.id,
          name: uac.carrera_uac.uac.nombre,
          semester: uac.grupo.semestre,
          group: uac.grupo.grupo,
          shift: uac.grupo.turno,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();
    getRegisteredSubjects();
  }, []);
  const handleSubjectFinish = async (data) => {
    setLoading(true);
    setSelectedSubject(data.subjectId);
    const response = await StudentService.getAvailableGroupsByStudentIdAndUacId(
      studentData.usuario_id,
      data.subjectId
    );
    if (response && response.success) {
      setCurrent(1);
      setGroups(
        response.data.map((g) => ({
          id: g.id,
          description: `${g.semestre} - ${g.grupo}`,
        }))
      );
      setLoading(false);
    }
  };
  const handleSubjectFinishFailed = () => {};
  const handleSave = async (data) => {
    setLoading(true);
    const response = await StudentService.enrollStudentToASignature(
      studentData.usuario_id,
      data.groupPeriodId,
      selectedSubject
    );
    if (response && response.success) {
      alerts.success("Listo", response.data.message);
      form.setFieldsValue({
        subjectId: null,
      });
      handleBack();
      await setUp();
      await getRegisteredSubjects();
    }
    setLoading(false);
  };
  const handleSaveFailed = () => {};
  const handleBack = () => {
    form2.setFieldsValue({
      groupPeriodId: null,
    });
    setCurrent(0);
  };
  return (
    <Loading loading={loading}>
      <h6>Registrar en una materia</h6>
      <Steps current={current}>
        {steps.map((item) => (
          <Steps.Step key={item} title={item} />
        ))}
      </Steps>
      <div className="steps-content">
        {current === 0 && (
          <>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubjectFinish}
              onFinishFailed={handleSubjectFinishFailed}
            >
              <Form.Item
                label="Lista de materias"
                name="subjectId"
                rules={validations.required}
              >
                <SearchSelect dataset={subjects} />
              </Form.Item>
              <PrimaryButton loading={loading} icon={<CheckCircleOutlined />}>
                Siguiente
              </PrimaryButton>
            </Form>
          </>
        )}
        {current === 1 && (
          <>
            <Form
              form={form2}
              layout="vertical"
              onFinish={handleSave}
              onFinishFailed={handleSaveFailed}
            >
              <Form.Item
                label="Lista de grupos"
                name="groupPeriodId"
                rules={validations.required}
              >
                <SearchSelect dataset={groups} />
              </Form.Item>
              <PrimaryButton loading={loading} icon={<CheckCircleOutlined />}>
                Guardar
              </PrimaryButton>
            </Form>
            <br />
            <ButtonCustom icon={<LeftOutlined />} onClick={handleBack}>
              Atras
            </ButtonCustom>
          </>
        )}
      </div>
      <hr></hr>
      <RegisteredSubjects subjects={registeredSubjects} />
    </Loading>
  );
};
