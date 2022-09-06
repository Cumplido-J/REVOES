import React, { useState } from "react";
import { Form, Row, Col, Input } from "antd";
import { Loading } from "../../../shared/components";
import Alerts from "../../../shared/alerts";
import StudentService from "../../../service/StudentService";
import { SearchOutlined } from "@ant-design/icons";
import { validateCurp } from "../../../shared/functions";
import { PrimaryButton } from "../../../shared/components";


const colProps = {
  xs: { span: 24 },
  md: { span: 8 }
};

const rowProps = {
  style: { marginBottom: "1em" }
};

const validations = {
  curp: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurp(value)
          ? Promise.resolve()
          : Promise.reject("¡Ingresa una CURP correcta!");
      }
    }
  ]
};

export default () => {
  const [form] = Form.useForm();
  const [loading] = useState(false);

  const handleOnFinish = async values => {
    console.log(values);
		const apiRespose = await StudentService.getStudentByCurp(values.curp);
		console.log(apiRespose)
  };

  const handleOnFinishFailed = () => {
    Alerts.error("Verifique sus campos", "Introduzca de nuevo el CURP");
  };


  return (
    <Loading loading={loading}>
			<h5>Agregar por CURP</h5>
      <Form
        form={form}
        onFinish={handleOnFinish}
        onFinishFailed={handleOnFinishFailed}
        layout="vertical"
      >
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="CURP:" name="curp" rules={validations.curp}>
              <Input placeholder="CURP" style={{ width: "90%" }} />
            </Form.Item>
            <PrimaryButton loading={loading} icon={<SearchOutlined />}>
              Buscar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
};
