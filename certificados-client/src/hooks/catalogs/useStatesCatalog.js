import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CatalogService from "../../service/CatalogService";
import { permissionList } from "../../shared/constants";
import { PermissionValidatorFn } from "../../shared/functions";

const useStatesCatalog = () => {
  const [statesLoading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const userStates = useSelector((store) => store.permissionsReducer.stateId);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    let statesCatalog = [];
    if (PermissionValidatorFn([permissionList.NACIONAL])) {
      const statesServiceResponse = await CatalogService.getStateCatalogs();
      if (statesServiceResponse && statesServiceResponse.success) {
        statesCatalog = statesServiceResponse.states.map(
          ({ id, description1 }) => ({
            id,
            description: description1,
          })
        );
      }
    } else if (PermissionValidatorFn([permissionList.ESTATAL])) {
      statesCatalog = userStates;
    }
    setStates(statesCatalog);
    setLoading(false);
  };

  return [statesLoading, states, loadStates];
};

export default useStatesCatalog;
