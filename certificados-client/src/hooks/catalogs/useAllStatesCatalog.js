import { useEffect, useState } from "react";
import CatalogService from "../../service/CatalogService";

const useAllStatesCatalog = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadStates = async () => {
    setLoading(true);
    const statesResponse = await CatalogService.getAllStateCatalogs();
    if (statesResponse?.success) {
      setStates(
        statesResponse?.data?.map(({ id, nombre }) => ({
          id,
          description: nombre,
        }))
      );
    }
    setLoading(false);
  };
  useEffect(() => {
    loadStates();
  }, []);
  return [states, loading, loadStates];
};

export default useAllStatesCatalog;
