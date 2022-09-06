import React, { useState } from "react";
import { ButtonCustom } from "../../../../shared/components";
import { FileTextOutlined } from "@ant-design/icons";
import styles from "./GroupsPeriodsSearchReports.module.css";
import { Modal } from "antd";
import StudentPopulationReportByGroup from "../StudentPopulationReportByGroup";
import ExportStudentsFromGroupSearch from "../ExportStudentsFromGroupSearch/ExportStudentsFromGroupSearch";

const GroupsPeriodsSearchReports = () => {
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
          <StudentPopulationReportByGroup />
        </div>
        <div className={styles.buttonDividerStyle}>
          <ExportStudentsFromGroupSearch />
        </div>
      </Modal>
    </>
  );
};

export default GroupsPeriodsSearchReports;
