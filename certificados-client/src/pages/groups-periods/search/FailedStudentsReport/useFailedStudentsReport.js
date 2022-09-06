import { useState } from "react";
import { failedStudentsReport } from "../../../../service/GroupsPeriodService";

const useFailedStudentsReport = (groupPeriodId) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [onlyFailedStudents, setOnlyFailedStudents] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const onSwitchChange = (check) => {
    setOnlyFailedStudents(check);
  };
  const generateFailedStudentsReport = async () => {
    setLoading(true);
    const pdfResponse = await failedStudentsReport(
      groupPeriodId,
      onlyFailedStudents
    );
    if (pdfResponse?.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return [
    generateFailedStudentsReport,
    loading,
    showModal,
    openModal,
    closeModal,
    onSwitchChange,
    onlyFailedStudents,
  ];
};

export default useFailedStudentsReport;
