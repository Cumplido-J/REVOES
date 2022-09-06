import React, { useState, useEffect } from "react";
import { Alert, Form, Row, Col } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import StudentFunctionsService from "../../service/StudentFunctionsService";
import { PageLoading, SearchSelect, PrimaryButton } from "../../shared/components";
import alerts from "../../shared/alerts";

const colProps = {
  xs: { span: 24 },
  md: { span: 12 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
export default function HomeStudentUpdateCareer({ getUserProfile }) {
    const [form] = Form.useForm();
    const [schoolCareers, setSchoolCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const getAvailableSchoolCareers = async () => {
        const response = await StudentFunctionsService.getAvailableSchoolCareers();
        const schoolCareers = response.schoolCareers.map((schoolCareer) => ({
          id: schoolCareer.id,
          description: `${schoolCareer.description1} - ${schoolCareer.description2}`,
        }));
        setSchoolCareers(schoolCareers);
        setLoading(false);
      };
      getAvailableSchoolCareers();
    }, []);
  
    const handleFinishFailed = () => {
      alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };
  
    const handleFinish = async (values) => {
      setLoading(true);
      const response = await StudentFunctionsService.updateStudentCareer(values);
      setLoading(false);
      if (!response.success) return;
      alerts.success(response.message);
      await getUserProfile();
    };
  
    return (
      <PageLoading loading={loading}>
        <Alert
          message={<strong>Atención</strong>}
          description={<>Favor de actualizar la carrera que cursaste</>}
          type="warning"
          showIcon
        />
        <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
          <Row {...rowProps} style={{ marginTop: "1em" }}>
            <Col {...colProps}>
              <Form.Item
                label="Carrera:"
                name="schoolCareerId"
                rules={[{ required: true, message: "Este campo es necesario" }]}
              >
                <SearchSelect dataset={schoolCareers} />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <br />
              <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="middle" fullWidth={false}>
                Guardar carrera
              </PrimaryButton>
            </Col>
          </Row>
        </Form>
      </PageLoading>
    );
  }
  