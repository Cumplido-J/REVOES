import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CatalogService from "../../service/CatalogService";
import { permissionList } from "../../shared/constants";
import { PermissionValidatorFn } from "../../shared/functions";

const useSchoolChange = (initialStateId = null) => {
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [stateId, setStateId] = useState(initialStateId);
  const userSchools = useSelector((store) => store.permissionsReducer.schoolId);
  const loadSchools = async () => {
    setLoading(true);
    if (PermissionValidatorFn([permissionList.PLANTEL])) {
      setSchools(userSchools);
    } else if (stateId) {
      const schoolsServiceResponse = await CatalogService.getSchoolCatalogs(
        stateId
      );
      if (schoolsServiceResponse && schoolsServiceResponse.success) {
        setSchools(
          schoolsServiceResponse.schools.map(
            ({ id, description1, description2 }) => ({
              id,
              description: `${description1} - ${description2}`,
            })
          )
        );
      }
    } else {
      setSchools([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSchools();
  }, [stateId]);

  return [loading, schools, setStateId];
};

export default useSchoolChange;
