import React, { useState } from "react";
import { ButtonCustom, Loading } from "../../../shared/components";
import { PieChartOutlined } from "@ant-design/icons";
import { Col, Form, Modal, Row, DatePicker } from "antd";
import StateSchoolCareerInputs from "../../../components/StateSchoolCareerInputs";
import { printSearchEnrollmentReportService } from "../../../service/ApplicantsService";
const { RangePicker } = DatePicker;
const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 24 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};
const validations = {
  required: [
    {
      required: true,
      message: "Este campo es requerido",
    },
  ],
};
const ApplicantsSearchEnrollmentReport = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [, setStateSchoolCareerInputs] = useState({
    loading: false,
    states: [],
    school: [],
    careers: [],
  });
  const handleOpen = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    form.resetFields();
  };
  const downloadHttpBlobResponse = (filename, blobResponse) => {
    const fileUrl = URL.createObjectURL(blobResponse);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
    document.body.removeChild(link);
  };
  const handleFinish = async (props) => {
    setLoading(true);
    console.log(props);
    const data = {
      plantel_id: props.schoolId,
      fecha_inicio: props.fechas[0],
      fecha_fin: props.fechas[1],
    };
    const response = await printSearchEnrollmentReportService(data);
    if (response.success) {
      downloadHttpBlobResponse("reporte_inscripcion.xlsx", response.data);
    }
    handleClose();
    setLoading(false);
  };
  const handleOk = () => {
    form.submit();
  };
  const handleOnStateSchoolCareerChange = (props) => {
    setStateSchoolCareerInputs(props);
  };
  return (
    <>
      <ButtonCustom
        icon={<PieChartOutlined />}
        fullWidth
        onClick={handleOpen}
        loading={loading}
      >
        Reporte de inscripción
      </ButtonCustom>
      <Modal
        visible={showModal}
        title="Reportes"
        onOk={handleOk}
        onCancel={handleClose}
        loading={loading}
      >
        <Loading loading={loading}>
          <Form form={form} onFinish={handleFinish} layout="vertical">
            <Row {...styles.rowProps}>
              <StateSchoolCareerInputs
                form={form}
                colProps={styles.colProps}
                onValuesChange={handleOnStateSchoolCareerChange}
                hideCareers
              />
              <Col {...styles.colProps}>
                <Form.Item
                  label="Fechas para corrección"
                  name="fechas"
                  rules={validations.required}
                >
                  <RangePicker
                    format="DD/MM/YYYY"
                    placeholder={["Fecha inicio", "Fecha límite"]}
                    width="100%"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Loading>
      </Modal>
    </>
  );
};

export default ApplicantsSearchEnrollmentReport;
