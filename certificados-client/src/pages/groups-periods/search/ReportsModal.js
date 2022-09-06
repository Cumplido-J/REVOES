import React, { useState } from "react";
import { ButtonIcon } from "../../../shared/components";
import { FileTextOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import ShowReportCard from "./ShowReportCard";
import PrintAttendanceList from "../../../components/PrintAttendanceList";
import AcademicRecordGroupButton from "./AcademicRecordGroupButton";
import DocumentProof from "./DocumentProof";
import ShowStatistics from "./ShowStatistics";
import ShowTeachersStatisticsByGroupPeriod from "./ShowTeachersByGroupPeriod";
import PrintRediByGroup from "./PrintRediByGroup";
import FailedStudentsReport from "./FailedStudentsReport/FailedStudentsReport";
import StudentPopulationReportByGroup from "./StudentPopulationReportByGroup";
import SemiannualConcentratedReport from "./SemiannualConcentratedReport";
import SemiannualEvaluationReport from "./SemiannualEvaluationReport";

const ReportsModal = ({ group }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const buttonDividerStyle = {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <>
      <ButtonIcon
        tooltip="Reportes"
        icon={<FileTextOutlined />}
        color="gold"
        onClick={toggleModal}
        tooltipPlacement="top"
      >
        Reportes
      </ButtonIcon>
      <Modal
        visible={showModal}
        title="Reportes"
        onCancel={toggleModal}
        footer={false}
      >
        <div style={buttonDividerStyle}>
          <PrintAttendanceList groupPeriodId={group.id} iconMode={false} />
        </div>
        <div style={buttonDividerStyle}>
          <ShowReportCard group={group} iconMode={false} />
        </div>
        <div style={buttonDividerStyle}>
          <AcademicRecordGroupButton
            periodId={group.periodo_id}
            groupPeriodId={group.id}
            iconMode={false}
          />
        </div>
        <div style={buttonDividerStyle}>
          <DocumentProof
            groupPeriodId={group.id}
            icon={false}
            plantelId={group?.plantel_carrera?.plantel_id}
          />
        </div>        
        <div style={buttonDividerStyle}>
          <ShowStatistics groupPeriodId={group.id} iconMode={false} />
        </div>
        <div style={buttonDividerStyle}>
          <ShowTeachersStatisticsByGroupPeriod
            groupPeriodId={group.id}
            iconMode={false}
          />
        </div>
        <div style={buttonDividerStyle}>
          <PrintRediByGroup groupPeriodId={group.id} />
        </div>
        <div style={buttonDividerStyle}>
          <FailedStudentsReport groupPeriodId={group.id} />
        </div>
        <div style={buttonDividerStyle}>
          <StudentPopulationReportByGroup groupsIds={[group.id]} />
        </div>
        <div style={buttonDividerStyle}>
          <SemiannualConcentratedReport groupPeriodId={group.id} />
        </div>
        <div style={buttonDividerStyle}>
          <SemiannualEvaluationReport groupPeriodId={group.id} />
        </div>
      </Modal>
    </>
  );
};

export default ReportsModal;
