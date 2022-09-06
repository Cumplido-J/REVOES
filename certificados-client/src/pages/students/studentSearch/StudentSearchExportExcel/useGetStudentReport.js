import { useSelector } from "react-redux";
import { useState } from "react";
import StudentService from "../../../../service/StudentService";

const useGetStudentReport = () => {
  const [loading, setLoading] = useState();
  const studentsIds = useSelector((store) =>
    store.studentsReducer.studentsSearchTable.map(
      ({ usuario_id }) => usuario_id
    )
  );
  /**
   *
   * @param {Object<{fecha_nacimiento: boolean|undefined, domicilio: boolean|undefined, telefono: boolean|undefined, email: boolean|undefined, sexo: boolean|undefined}>} data
   */
  const downloadExcel = async (data) => {
    setLoading(true);
    // Parse data
    for (const key in data) {
      data[key] = !!data[key];
    }
    data.ids = Object.assign([], studentsIds);
    const response = await StudentService.getStudentReport(data);
    if (response?.success) {
      const fileUrl = URL.createObjectURL(response.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return [downloadExcel, studentsIds, loading];
};
export default useGetStudentReport;
