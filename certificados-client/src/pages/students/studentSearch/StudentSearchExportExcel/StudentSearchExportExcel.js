import React from "react";
import { ButtonCustom, Loading } from "../../../../shared/components";
import { FileExcelOutlined } from "@ant-design/icons";
import { Col, Form, Modal, Row, Switch } from "antd";
import useStudentSearchModalForm from "./useStudentSearchModalForm";
import useGetStudentReport from "./useGetStudentReport";
const StudentSearchExportExcel = () => {
  const [showModal, openModal, closeModal, onOk, form, formSwitches] =
    useStudentSearchModalForm();
  const [downloadExcel, studentsIds, loading] = useGetStudentReport();
  const handleSubmit = async (data) => {
    await downloadExcel(data);
    closeModal();
  };
  return (
    <>
      <ButtonCustom
        color="green"
        icon={<FileExcelOutlined />}
        fullWidth
        onClick={openModal}
        disabled={!studentsIds || !studentsIds.length || loading}
      >
        Exportar a excel
      </ButtonCustom>
      <Modal
        visible={showModal}
        title="Exportar a excel"
        cancelText="Cerrar"
        onCancel={closeModal}
        okText="Generar excel"
        onOk={onOk}
        confirmLoading={loading}
      >
        <Loading loading={false}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <fieldset>
              <legend>Datos opcionales</legend>
              <Row style={{ marginBottom: "1em" }}>
                {formSwitches.map((formSwitch, i) => (
                  <Col key={i} xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label={formSwitch.label}
                      valuePropName="checked"
                      name={formSwitch.name}
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </fieldset>
          </Form>
        </Loading>
      </Modal>
    </>
  );
};
export default StudentSearchExportExcel;
