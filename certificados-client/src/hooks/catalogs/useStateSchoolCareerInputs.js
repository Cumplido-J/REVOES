import useSchoolCatalog from "./useSchoolCatalog";
import useStatesCatalog from "./useStatesCatalog";
import { useMemo } from "react";
import useCareersCatalog from "./useCareersCatalog";

const useStateSchoolCareerInputs = ({
  initialStateId = null,
  initialSchoolId = null,
  form = null,
  naming = {
    state: "stateId",
    school: "schoolId",
    career: "careerId",
  },
  hideCareers,
}) => {
  const [statesLoading, states] = useStatesCatalog();
  const [loadingSchools, schools, setSchoolStateId] =
    useSchoolCatalog(initialStateId);
  const [loadingCareers, careers, setCareerSchoolId] =
    useCareersCatalog(initialSchoolId);
  const handleOnStateChange = (stateId) => {
    setSchoolStateId(stateId);
    if (form)
      form.setFieldsValue({
        [naming.school]: undefined,
        [naming.career]: undefined,
      });
  };
  const handleOnSchoolsChange = (schoolId) => {
    setCareerSchoolId(schoolId);
    if (form)
      form.setFieldsValue({
        [naming.career]: undefined,
      });
  };
  const loading = useMemo(
    () => statesLoading || loadingSchools || loadingCareers,
    [statesLoading, loadingSchools, loadingCareers]
  );
  return [
    loading,
    states,
    handleOnStateChange,
    schools,
    handleOnSchoolsChange,
    careers,
  ];
};

export default useStateSchoolCareerInputs;
