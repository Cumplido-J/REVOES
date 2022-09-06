import React from "react";
import { ButtonCustom } from "../../../shared/components";
import { FileTextOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Modal } from "antd";
import styles from "./ApplicantsSearchReportsModal.module.css";
import ApplicantsSearchEnrollmentReport from "./ApplicantsSearchEnrollmentReport";

const ApplicantsSearchReportsModal = () => {
  const [showModal, setShowModal] = useState(false);
  const handleToggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <>
      <ButtonCustom
        color="primary"
        icon={<FileTextOutlined />}
        width="auto"
        onClick={handleToggleModal}
      >
        Generar reportes
      </ButtonCustom>
      <Modal
        visible={showModal}
        title="Reportes"
        onCancel={handleToggleModal}
        footer={false}
      >
        <div className={styles.buttonDividerStyle}>
          <ApplicantsSearchEnrollmentReport />
        </div>
      </Modal>
    </>
  );
};

export default ApplicantsSearchReportsModal;
