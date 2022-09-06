import React, { useState } from "react";
import { ButtonIcon } from "../../../../shared/components";
import { FileTextOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import GenerateStudentId from "../GenerateStudentId";
import PermissionValidator from "../../../../components/PermissionValidator";
import { permissionList } from "../../../../shared/constants";
import AcademicRecord from "../AcademicRecord";
import DocumentProof from "../DocumentProof";
import StudentReportCard from "../StudentReportCard";
import styles from "./StudentDocumentsModal.module.css";
import StudentAllSemestersReportCard from "../StudentAllSemestersReportCard";

const StudentDocumentsModal = ({ student }) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <>
      <ButtonIcon
        tooltip="Documentos"
        icon={<FileTextOutlined />}
        color="gold"
        onClick={toggleModal}
        tooltipPlacement="top"
      />
      <Modal
        visible={showModal}
        title="Generar documentos del alumno"
        onCancel={toggleModal}
        footer={false}
      >
        <div className={styles.buttonDividerStyle}>
          <GenerateStudentId student={student} icon={false} />
        </div>
        <PermissionValidator permissions={[permissionList.GENERAR_BOLETAS]}>
          <div className={styles.buttonDividerStyle}>
            <AcademicRecord student={student} icon={false} />
          </div>
          <div className={styles.buttonDividerStyle}>
            <DocumentProof student={student} icon={false} />
          </div>
          <div className={styles.buttonDividerStyle}>
            <StudentReportCard student={student} icon={false} />
          </div>
          <div className={styles.buttonDividerStyle}>
            <StudentAllSemestersReportCard studentId={student?.usuario_id} />
          </div>
        </PermissionValidator>
      </Modal>
    </>
  );
};

export default StudentDocumentsModal;
