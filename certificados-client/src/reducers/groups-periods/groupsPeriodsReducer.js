import { SET_GROUPS_TABLE } from "./actions/setGroupsPeriods";
import { UPDATE_GROUPS_PERIOD_RECORD } from "./actions/updateGroupPeriodRercord";
import { DELETE_GROUPS_PERIOD_RECORD } from "./actions/deleteGroupPeriodRercord";
import { SET_PERIODS_OPTIONAL_SIGNATURES } from "./actions/setPeriodsOptionalSignatures";
import { ADD_NEW_OPTIONAL_SIGNATURE } from "./actions/addNewOptionalSignature";
import { REMOVE_OPTIONAL_SIGNATURE } from "./actions/removeOptionalSignature";

const initialState = {
  groupsPeriodList: [],
  groupsPeriodsOptionalSignaturesList: [],
  groupsPeriodsOptionalSignaturesSelected: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_GROUPS_TABLE:
      return {
        ...state,
        groupsPeriodList: action.groups,
      };
    case UPDATE_GROUPS_PERIOD_RECORD:
      return {
        ...state,
        groupsPeriodList: state.groupsPeriodList.map((g) =>
          g.id === action.group.id ? action.group : g
        ),
      };
    case DELETE_GROUPS_PERIOD_RECORD:
      return {
        ...state,
        groupsPeriodList: state.groupsPeriodList.filter(
          (g) => g.id !== action.id
        ),
      };
    case SET_PERIODS_OPTIONAL_SIGNATURES:
      return {
        ...state,
        groupsPeriodsOptionalSignaturesList: action.list,
        groupsPeriodsOptionalSignaturesSelected: action.selected,
      };
    case ADD_NEW_OPTIONAL_SIGNATURE:
      return {
        ...state,
        groupsPeriodsOptionalSignaturesList: state.groupsPeriodsOptionalSignaturesList.filter(
          (signature) => signature.id !== action.signature.id
        ),
        groupsPeriodsOptionalSignaturesSelected: [
          ...state.groupsPeriodsOptionalSignaturesSelected,
          action.signature,
        ],
      };
    case REMOVE_OPTIONAL_SIGNATURE:
      return {
        ...state,
        groupsPeriodsOptionalSignaturesSelected: state.groupsPeriodsOptionalSignaturesSelected.filter(
          (signature) => signature.id !== action.signature.id
        ),
        groupsPeriodsOptionalSignaturesList: [
          ...state.groupsPeriodsOptionalSignaturesList,
          action.signature,
        ],
      };
    default:
      return state;
  }
}
