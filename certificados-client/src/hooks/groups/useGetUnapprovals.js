import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUnapprovedGroups } from "../../reducers/groups/actions/setUnapprovedGroups";
import { getUnapprovedGroups } from "../../service/ApprovalsService";

const useGetUnapprovals = () => {
  const unapprovals = useSelector(
    (state) => state.groupsReducer.unapprovedGroups
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getUnapprovals = async (filters) => {
    setLoading(true);
    const response = await getUnapprovedGroups(filters);
    if (response?.success) {
      dispatch(setUnapprovedGroups(response.groups));
    }
    setLoading(false);
  };

  useEffect(() => {
    getUnapprovals();
  }, []);

  return [loading, unapprovals, getUnapprovals];
};

export default useGetUnapprovals;
