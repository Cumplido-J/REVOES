import React, { useEffect, useState } from "react";

import { Form,Input,Select } from "antd";
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
  const [extra, setExtra] = useState("");

  useEffect(() => {
    if (!option.includes("Estudiar")) form.setFieldsValue({ q5: null, q6: null, q7: null,q8: null,q9: null });
    if (!option.includes("Trabajar")) form.setFieldsValue({q10: null, q11: null, q12: null,q13: null,q14: null });
    if (!option.includes("Estudiar y Trabajar")) form.setFieldsValue({q5: null, q6: null, q7: null,q8: null,q9: null,q10: null, q11: null, q12: null,q13: null,q14: null  });
    if (!option.includes("Otra")) form.setFieldsValue({ q15: null,q16: null});

    //if (!extra.includes("Dentro del país")) form.setFieldsValue({ q6: null});
    //if (!extra.includes("Fuera del país")) form.setFieldsValue({ q06: null});

  }, [option, form]); 

  useEffect(() => {
    if (!extra.includes("Dentro del país")) form.setFieldsValue({ q6: null});
    if (!extra.includes("Fuera del país")) form.setFieldsValue({ q06: null});
  }, [extra, form]); 
  
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

        {option.includes("Estudiar") && (
          <>
            <Subtitle>Continuidad de Estudios</Subtitle>
            <SurveyInput question={Questions.q5} />

            <SurveySelect onChange={setExtra} question={Questions.q00} />
            {extra.includes("Dentro del país") && (
              <>
              <SurveySelect question={Questions.q6} />
              </>
            )}
            {extra.includes("Fuera del país") && (
              <>
              <SurveyInput question={Questions.q06} />
              </>
            )}            
            <SurveySelect question={Questions.q7} />
            <SurveyInput question={Questions.q8} />
            <SurveySelect question={Questions.q9} />            
          </>
        )} 

        {option.includes("Trabajar") && (
          <>
            <Subtitle>Trabajar</Subtitle>
            <SurveyInput  question={Questions.q10} />
            <SurveyInput  question={Questions.q11} />
            <SurveyInput  question={Questions.q12} />
            <SurveySelect question={Questions.q13} />
            <SurveySelect question={Questions.q14} />
          </>
        )}

        {option.includes("Otra") && (
          <>
            <Subtitle>Otro</Subtitle>
            <SurveySelect  question={Questions.q15} />
            <SurveyInput question={Questions.q16} />
          </>
        )}          
        <Form.Item style={{ textAlign: "center" }}>
          <PrimaryButton icon={<SendOutlined />} loading={loading}>
            Enviar respuestas
          </PrimaryButton>
        </Form.Item>
      </Form>
    </Loading>
  );
}
