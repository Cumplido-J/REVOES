export const SET_USER_PERMISSIONS = "PERMISSIONS/SET_PERMISSIONS";

export function setPermissions(permissions, stateId, schoolId, userProfile, period) {
  return {
    type: SET_USER_PERMISSIONS,
    permissions,
    stateId,
    schoolId,
    userProfile,
    period
  };
}
