import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApplicants } from "../../../../service/ApplicantsService";
import { setApplicants } from "../../../../reducers/applicantsReducer/actions/setApplicants";
import { toggleLoadingApplicantsList } from "../../../../reducers/applicantsReducer/actions/toggleLoadingApplicantsList";

const useGetApplicants = () => {
  const dispatch = useDispatch();
  const applicants = useSelector(
    (store) => store.applicantsReducer.applicantsList
  );
  const loading = useSelector(
    (store) => store.applicantsReducer.loadingApplicantsList
  );
  const loadApplicants = async ({ state, school, searchText }) => {
    dispatch(toggleLoadingApplicantsList());
    const applicantsResponse = await getApplicants({
      state,
      school,
      searchText,
    });
    if (applicantsResponse?.success) {
      dispatch(setApplicants(applicantsResponse.data));
    }
    dispatch(toggleLoadingApplicantsList());
  };
  return [applicants, loading, loadApplicants];
};

export default useGetApplicants;
