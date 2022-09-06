import { useEffect, useState } from "react";
import CatalogService from "../../service/CatalogService";

const useCareersCatalog = (initialSchoolId = null) => {
  const [loading, setLoading] = useState(false);
  const [careers, setCareers] = useState([]);
  const [schoolId, setSchoolId] = useState(initialSchoolId);
  const loadCareers = async () => {
    setLoading(true);
    if (!schoolId) {
      setCareers([]);
    } else {
      const careersServiceResponse = await CatalogService.getCareerCatalogs(
        schoolId
      );
      if (careersServiceResponse?.success) {
        setCareers(
          careersServiceResponse?.careers.map(
            ({ id, description1, description2 }) => ({
              id,
              description: `${description1} - ${description2}`,
            })
          )
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCareers();
  }, [schoolId]);

  return [loading, careers, setSchoolId];
};

export default useCareersCatalog;
