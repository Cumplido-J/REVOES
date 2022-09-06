import React from "react";
import { Form, Input, Select } from "antd";

export function SurveySelect({ question, onChange }) {
  if (!onChange) onChange = () => {};
  return (
    <Form.Item label={question.question} name={question.name} rules={question.rules} style={{ marginBottom: "2em" }}>
      <Select placeholder="Selecciona una opción" allowClear onChange={onChange}>
        {question.options.map((option, index) => (
          <Select.Option value={option} key={index}>
            {option}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

export function SurveyInput({ question }) {
  return (
    <Form.Item label={question.question} name={question.name} rules={question.rules} style={{ marginBottom: "2em" }}>
      <Input placeholder="Ingresa tu respuesta" />
    </Form.Item>
  );
}
