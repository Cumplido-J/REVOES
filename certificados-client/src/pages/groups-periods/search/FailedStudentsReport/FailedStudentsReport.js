import React from "react";
import { ButtonCustom, Loading } from "../../../../shared/components";
import { FallOutlined } from "@ant-design/icons";
import useFailedStudentsReport from "./useFailedStudentsReport";
import { Col, Form, Modal, Row, Switch } from "antd";

const FailedStudentsReport = ({ groupPeriodId }) => {
  const [
    generateReport,
    loading,
    showModal,
    openModal,
    closeModal,
    onSwitchChange,
    onlyFailedStudents,
  ] = useFailedStudentsReport(groupPeriodId);
  return (
    <>
      <ButtonCustom
        icon={<FallOutlined />}
        onClick={openModal}
        loading={loading}
      >
        Reporte de alumnos reprobados
      </ButtonCustom>
      <Modal
        visible={showModal}
        title="Reporte de alumnos reprobados"
        cancelText="Cerrar"
        onCancel={closeModal}
        okText="Generar reporte"
        onOk={generateReport}
        confirmLoading={loading}
      >
        <Loading loading={false}>
          <Form.Item label="Solo alumnos reprobados">
            <Switch
              checked={onlyFailedStudents}
              onChange={onSwitchChange}
              disabled={loading}
              loading={loading}
            />
          </Form.Item>
        </Loading>
      </Modal>
    </>
  );
};

export default FailedStudentsReport;
