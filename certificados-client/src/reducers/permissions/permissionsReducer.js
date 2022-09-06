import { SET_USER_PERMISSIONS } from "./actions/setUserPermissions";

const initialState = {
  permissions: [],
  stateId: [],
  schoolId: [],
  userProfile: {},
  period: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_PERMISSIONS:
      return {
        ...state,
        permissions: action.permissions,
        stateId: action.stateId,
        schoolId: action.schoolId,
        userProfile: action.userProfile,
        period: action.period
      };
    default:
      return state;
  }
}
