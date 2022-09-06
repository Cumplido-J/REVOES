import { useEffect, useState } from "react";
import CatalogService from "../../service/CatalogService";

const useMedicalInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const loadInstitutions = async () => {
    const institutionsResponse = await CatalogService.getMedicalIntitutions();
    if (institutionsResponse?.success) {
      setInstitutions(institutionsResponse?.data);
    }
  };
  useEffect(() => {
    loadInstitutions();
  }, []);
  return [institutions, loadInstitutions];
};

export default useMedicalInstitutions;
