import { useEffect, useState } from "react";
import CatalogService from "../../service/CatalogService";

const useCitiesCatalog = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadCities = async (stateId) => {
    setLoading(true);
    if (stateId) {
      const response = await CatalogService.getCityCatalogs(stateId);
      if (response?.success)
        setCities(
          response?.cities?.map(({ id, description1 }) => ({
            id,
            description: description1,
          }))
        );
    } else {
      setCities([]);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadCities();
  }, []);
  return [cities, loadCities, loading];
};

export default useCitiesCatalog;
