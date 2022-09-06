import React, { useEffect, useState } from "react";

import { Form } from "antd";
import { SendOutlined } from "@ant-design/icons";

import SurveyService from "../../service/SurveyService";
import { Loading, PrimaryButton, Subtitle, Title } from "../../shared/components";
import Alerts from "../../shared/alerts";

import { SurveyInput, SurveySelect } from "./SurveyComponents";
import Questions from "./Questions";
import { canAnswerSurvey } from "../../shared/functions";
import StudentInfoNotUpdated from "../studentinfo/StudentInfoNotUpdated";

export default function Survey({ history, getUserProfile, userProfile }) {
  const [form] = Form.useForm();
  const [option, setOption] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!option.includes("Estudiar")) form.setFieldsValue({ q2: null, q3: null, q4: null });
    if (!option.includes("Trabajar")) form.setFieldsValue({ q5: null, q6: null, q7: null });
    if (!option.includes("Otra")) form.setFieldsValue({ q8: null });
  }, [option, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    const response = await SurveyService.submitSurvey(values);
    if (!response.success) setLoading(false);
    else SurveyService.successfulSurvey(history, getUserProfile, response.confirmationFolio);
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente la encuesta", "Existen campos sin llenar.");
  };

  if (!canAnswerSurvey(userProfile.studentProfile.lastUpdateInfo)) return <StudentInfoNotUpdated />;
  return (
    <Loading loading={loading}>
      <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
        <Title>ENCUESTA DE SEGUIMIENTO DE EGRESADOS</Title>
        <SurveySelect question={Questions.q1} />
        <SurveySelect question={Questions.q2} />
        <SurveySelect question={Questions.q3} />

        <SurveySelect onChange={setOption} question={Questions.q4} />

        {option.includes("Estudi") && (
          <>
            <Subtitle>Continuidad de Estudios</Subtitle>
            <SurveyInput question={Questions.q5} />
            <SurveySelect question={Questions.q6} />
            <SurveySelect question={Questions.q7} />
          </>
        )}

        {option.includes("Trabajar") && (
          <>
            <Subtitle>Trabajar</Subtitle>
            <SurveySelect question={Questions.q8} />
            <SurveySelect question={Questions.q9} />
            <SurveySelect question={Questions.q10} />
          </>
        )}

        {option.includes("Otra") && (
          <>
            <Subtitle>Otro</Subtitle>
            <SurveyInput question={Questions.q11} />
          </>
        )}
        <Subtitle>EVALUACIÓN DE SERVICIOS DEL PLANTEL</Subtitle>
        <label>¿Cómo calificas los servicios ofrecidos de tu plantel, por las áreas de? </label>

        <SurveySelect question={Questions.q12} />
        <SurveySelect question={Questions.q13} />
        <SurveySelect question={Questions.q14} />
        <SurveySelect question={Questions.q15} />
        <SurveySelect question={Questions.q16} />
        <SurveySelect question={Questions.q17} />
        <SurveySelect question={Questions.q18} />
        <SurveySelect question={Questions.q19} />
        <SurveySelect question={Questions.q20} />
        <SurveySelect question={Questions.q21} />
        <SurveySelect question={Questions.q22} />
        <SurveySelect question={Questions.q23} />
        <SurveySelect question={Questions.q24} />
        <SurveySelect question={Questions.q25} />
        <SurveySelect question={Questions.q26} />

        <SurveyInput question={Questions.q27} />
        <SurveyInput question={Questions.q28} />

        <Form.Item style={{ textAlign: "center" }}>
          <PrimaryButton icon={<SendOutlined />} loading={loading}>
            Enviar respuestas
          </PrimaryButton>
        </Form.Item>
      </Form>
    </Loading>
  );
}
