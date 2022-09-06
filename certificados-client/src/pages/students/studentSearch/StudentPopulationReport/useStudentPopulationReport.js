import { useState } from "react";
import { useSelector } from "react-redux";
import StudentService from "../../../../service/StudentService";

const useStudentPopulationReport = () => {
  const [loading, setLoading] = useState(false);
  const studentsIds = useSelector((store) =>
    store.studentsReducer.studentsSearchTable.map(
      ({ usuario_id }) => usuario_id
    )
  );
  const generatePopulationReport = async () => {
    setLoading(true);
    const response = await StudentService.studentPopulationReport(studentsIds);
    if (response?.success) {
      const fileUrl = URL.createObjectURL(response.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return [generatePopulationReport, loading, studentsIds];
};
export default useStudentPopulationReport;
