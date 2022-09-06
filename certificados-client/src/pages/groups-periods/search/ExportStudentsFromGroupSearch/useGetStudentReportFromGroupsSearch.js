import { useSelector } from "react-redux";
import { useState } from "react";
import { exportStudentsFromGroupSearch } from "../../../../service/GroupsPeriodService";

const useGetStudentReportFromGroupSearch = () => {
  const [loading, setLoading] = useState();
  const groupsIds = useSelector((store) =>
    store.groupsPeriodsReducer.groupsPeriodList.map(({ id }) => id)
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
    data.ids = Object.assign([], groupsIds);
    const response = await exportStudentsFromGroupSearch(data);
    if (response?.success) {
      const fileUrl = URL.createObjectURL(response.data);
      window.open(fileUrl);
    }
    setLoading(false);
  };
  return [downloadExcel, groupsIds, loading];
};
export default useGetStudentReportFromGroupSearch;
