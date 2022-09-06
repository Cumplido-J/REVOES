import { SET_APPLICANTS } from "./actions/setApplicants";
import { TOGGLE_LOADING_APPLICANTS_LIST } from "./actions/toggleLoadingApplicantsList";
import { DELETE_APPLICANT } from "./actions/deleteApplicant";

const initialState = {
  applicantsList: [],
  loadingApplicantsList: false,
};

const applicantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APPLICANTS:
      return {
        ...state,
        applicantsList: action.applicantsList,
      };
    case TOGGLE_LOADING_APPLICANTS_LIST:
      return {
        ...state,
        loadingApplicantsList: !state.loadingApplicantsList,
      };
    case DELETE_APPLICANT:
      return {
        ...state,
        applicantsList: state.applicantsList.filter(
          (a) => a?.id !== action?.applicantId
        ),
      };
    default:
      return state;
  }
};

export default applicantsReducer;
