import React, { useState } from "react";
import { ButtonCustom } from "../../../../shared/components";
import { FileTextOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import StudentSearchExportExcel from "../StudentSearchExportExcel/StudentSearchExportExcel";
import styles from "./StudentReportModal.module.css";
import StudentPopulationReport from "../StudentPopulationReport/StudentPopulationReport";
const StudentReportModal = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <>
      <ButtonCustom
        color="primary"
        icon={<FileTextOutlined />}
        width="auto"
        onClick={toggleModal}
      >
        Generar reportes desde busqueda
      </ButtonCustom>
      <Modal
        visible={showModal}
        title="Reportes"
        onCancel={toggleModal}
        footer={false}
      >
        <div className={styles.buttonDividerStyle}>
          <StudentSearchExportExcel />
        </div>
        <div className={styles.buttonDividerStyle}>
          <StudentPopulationReport />
        </div>
      </Modal>
    </>
  );
};

export default StudentReportModal;
