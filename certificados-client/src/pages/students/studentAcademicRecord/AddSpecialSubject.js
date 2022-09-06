import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Form, Row, Col, InputNumber, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Loading, ButtonIcon, SearchSelect } from "../../../shared/components";

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 12 },
  },
  colNumberProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};

const gradeTypes = [
  {
    id: 1,
    description: "Extraordinario"
  },
  {
    id: 2,
    description: "Recursamiento semestral"
  },
  {
    id: 3,
    description: "Recursamiento intersemestral"
  },
]

export default ({data}) => {
  const semestersList = useSelector((store) => store.academicRecordReducer.semestersStudentList);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [partials, setPartials] = useState(false);
  const [loading, setLoading] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [group, setGroup] = useState([]);
  const [responseMessage, setResponseMessage] = useState([]);
  const [form] = Form.useForm();
  const primaryColor = "#9d2449";

  const handleOk = () => {
    form.submit();
  }

  const handleConfirmStudentRegister = async () => {

  };

  const setUp = async () => {
    
  };

  const handleVisibleModal = () => {
    form.setFieldsValue({ semester_id: data[0].carrera_uac.semestre, carrera_uac_id: data[0].carrera_uac.uac.nombre });
    setIsVisible(true);
  }

  const handleOnCancel = () => {
    setIsVisible(false)
  }

  const handleFinish = () => {

  }

  const handleFinishFailed = () => {

  }

  const handleCancelModal = () => {
    setIsModalVisible(false);
  }

  const handleOnPeriodsChange = () => {
    
  }

  const handleOnGroupChange = () => {
    
  }

  useEffect(() => {
    setUp();
  }, []);



  return (
    <>
      <ButtonIcon
        tooltip="Agregar calificación extraordinaria"
        icon={<PlusOutlined />}
        color="blue"
        onClick={handleVisibleModal}
        tooltipPlacement="top"
        loading={loading}
      />
      <Modal
        visible={isVisible}
        title="Agregar asignatura extraordinaria"
        onOk={handleOk}
        onCancel={handleOnCancel}
        width={1000}
        confirmLoading={loading}
        okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}
      >
        <Form
          form={form}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          layout="vertical"
        >
          <Loading loading={loading}>
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Asignatura"
                  name="carrera_uac_id"
                >
                  <SearchSelect
                    dataset={subjects}
                    disabled={!subjects.length}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Semestre"
                  name="semester_id"
                >
                  <SearchSelect
                    dataset={semestersList}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Periodo"
                  name="periodo_id"
                >
                  <SearchSelect
                    dataset={periods}
                    /* disabled={!periods.length} */
                    onChange={handleOnPeriodsChange}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Grupo"
                  name="grupo_id"
                >
                  <SearchSelect
                    dataset={group}
                    /* disabled={!group.length} */
                    onChange={handleOnGroupChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Loading>
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item
                label="Tipo de calificación"
                name="grade_type"
              >
                <SearchSelect
                  dataset={gradeTypes}
                  disabled={!gradeTypes.length}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Calificacion"
                name="grade"
              >
                <InputNumber
                  style={{ width: "90%" }}
                  step={0.1}
                  min={0}
                  max={10}
                  /* disabled={!partials} */
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Modal title="Confimación" visible={isModalVisible} confirmLoading={loading} onOk={handleConfirmStudentRegister} onCancel={handleCancelModal} okText='Si' cancelText='No' okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}>
          <ExclamationCircleOutlined /> <span>{responseMessage}</span>
        </Modal>
      </Modal>
    </>
  );
};
