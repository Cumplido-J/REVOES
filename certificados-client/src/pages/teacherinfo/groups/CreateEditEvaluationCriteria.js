import React, { useState } from "react";
import { Modal, Form, Row, Col, InputNumber } from "antd";
import { FolderAddOutlined, EditOutlined } from "@ant-design/icons";
import {
  PrimaryButton,
  ButtonIcon,
  Loading,
  SearchSelect,
} from "../../../shared/components";
import alerts from "../../../shared/alerts";
import {
  createEvaluationCriteriaByTeacherSubjectId,
  editEvaluationCriteriaByTeacherSubjectId,
} from "../../../service/TeacherService";

const styles = {
  colProps: {
    xs: { span: 24 },
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
  criteria: [
    {
      required: true,
      message:
        "Este campo es requerido, si no desea utilizar esta rúbrica asigne el valor cero",
    },
  ],
};

export default ({
  evaluation,
  teacherSubjectId,
  availablePartials = [1, 2, 3],
  onSaveReload,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const primaryColor = "#9d2449";
  const editSetup = async () => {
    form.setFieldsValue(evaluation);
    updateCurrentPercentage(evaluation);
  };
  const handleOnOpen = async () => {
    setCurrentPercentage(0);
    setLoading(true);
    setShowModal(true);
    if (evaluation) {
      await editSetup();
    }
    setLoading(false);
  };
  const createCriteria = async (data) => {
    setLoading(true);
    const createResponse = await createEvaluationCriteriaByTeacherSubjectId(
      data
    );
    if (createResponse && createResponse.success) {
      await onSaveReload();
      handleCancel();
      alerts.success("Listo", "Se ha guardado la rubrica de evaluación");
    }
    setLoading(false);
  };
  const editCriteria = async (data) => {
    setLoading(true);
    const createResponse = await editEvaluationCriteriaByTeacherSubjectId(
      data,
      evaluation.id
    );
    if (createResponse && createResponse.success) {
      await onSaveReload();
      handleCancel();
      alerts.success("Listo", "Se ha actualizado la rubrica de evaluación");
    }
    setLoading(false);
  };
  const handleOk = () => {
    if (currentPercentage === 100) {
      form.submit();
    } else {
      alerts.warning(
        "Error",
        "La suma de los criterios de evaluación deben ser 100"
      );
    }
  };
  const handleSave = (data) => {
    data = {
      ...data,
      docente_asignatura_id: teacherSubjectId,
    };
    if (evaluation) {
      editCriteria(data);
    } else {
      createCriteria(data);
    }
  };
  const handleSaveFailed = () => {};
  const handleCancel = () => {
    setShowModal(false);
    // TODO: Clean fields value
    form.setFieldsValue({
      parcial: null,
      total_asistencias: null,
      asistencia: 0,
      examen: 0,
      practicas: 0,
      tareas: 0,
    });
  };
  const updateCurrentPercentage = () => {
    const { asistencia, examen, practicas, tareas } = form.getFieldValue();
    setCurrentPercentage(asistencia + examen + practicas + tareas);
  };

  return (
    <>
      {evaluation ? (
        <ButtonIcon
          tooltip="Editar"
          icon={<EditOutlined />}
          color="green"
          onClick={handleOnOpen}
          tooltipPlacement="top"
        />
      ) : availablePartials.length ? (
        <>
          <PrimaryButton
            icon={<FolderAddOutlined />}
            color="geekblue"
            onClick={handleOnOpen}
          >
            Crear rubrica de evaluación
          </PrimaryButton>
          <br />
          <br />
        </>
      ) : (
        false
      )}
      <Modal
        visible={showModal}
        confirmLoading={loading}
        onOk={handleOk}
        onCancel={handleCancel}
        title={
          evaluation
            ? "Editar rubrica de evaluación"
            : "Crear rubrica de evaluación"
        }
        okText="Guardar"
        maskClosable={false}
        okButtonProps={{ style: {backgroundColor: primaryColor, borderColor: primaryColor,} }}
      >
        <Loading loading={loading}>
          <Form
            form={form}
            onFinish={handleSave}
            onFinishFailed={handleSaveFailed}
            layout="vertical"
          >
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Parcial"
                  name="parcial"
                  rules={validations.required}
                >
                  <SearchSelect
                    dataset={availablePartials.map((p) => ({
                      id: p,
                      description: p,
                    }))}
                  />
                </Form.Item>
              </Col>
              {/* <Col {...styles.colProps}>
                <Form.Item
                  label="Total de asistencias del parcial"
                  name="total_asistencias"
                  rules={validations.required}
                >
                  <InputNumber min={1} style={{ width: "90%" }} />
                </Form.Item>
              </Col> */}
            </Row>
            <fieldset>
              <legend>Porcentajes (deben sumar 100)</legend>
            </fieldset>
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Asistencia (%)"
                  name="asistencia"
                  initialValue={0}
                  rules={validations.criteria}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: "90%" }}
                    onChange={updateCurrentPercentage}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Examen (%)"
                  name="examen"
                  initialValue={0}
                  rules={validations.criteria}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: "90%" }}
                    onChange={updateCurrentPercentage}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Practicas (%)"
                  name="practicas"
                  initialValue={0}
                  rules={validations.criteria}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: "90%" }}
                    onChange={updateCurrentPercentage}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Tareas (%)"
                  name="tareas"
                  initialValue={0}
                  rules={validations.criteria}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: "90%" }}
                    onChange={updateCurrentPercentage}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <h4>{currentPercentage}% de 100%</h4>
        </Loading>
      </Modal>
    </>
  );
};
